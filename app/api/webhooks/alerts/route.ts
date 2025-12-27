import { NextResponse } from "next/server";
import { handleAlertWebhook } from "@/lib/webhooks/handlers/alert-handler";
import { createServiceClient } from "@/lib/supabase/server";
import type { NextRequest } from "next/server";

/**
 * Webhook endpoint for receiving alerts from various providers
 * This endpoint should be publicly accessible but secured with webhook signatures
 */
export async function POST(req: NextRequest) {
  try {
    // Get organization ID from query params or header
    // In production, you'd validate webhook signatures here
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("org_id") || req.headers.get("x-organization-id");

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Verify organization exists
    const supabase = createServiceClient();
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id")
      .eq("id", organizationId)
      .single();

    if (orgError || !org) {
      return NextResponse.json(
        { error: "Invalid organization ID" },
        { status: 400 }
      );
    }

    // Detect provider from headers or query params
    const provider = (req.headers.get("x-webhook-provider") ||
      searchParams.get("provider")) as
      | "pagerduty"
      | "opsgenie"
      | "datadog"
      | "generic"
      | null;

    const body = await req.json();

    // Process webhook
    const result = await handleAlertWebhook(organizationId, body, provider || undefined);

    // TODO: Trigger AI investigation asynchronously
    // This would be done via a job queue in production

    return NextResponse.json({
      success: true,
      incidentId: result.incidentId,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      {
        error: "Failed to process webhook",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
