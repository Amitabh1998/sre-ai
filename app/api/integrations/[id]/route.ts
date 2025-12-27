import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { IntegrationService } from "@/lib/api/integrations/service";
import { getCurrentUserOrganizationId } from "@/lib/db/queries/users";
import type { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    const organizationId = await getCurrentUserOrganizationId();
    if (!organizationId) {
      return NextResponse.json(
        { error: "User not associated with an organization" },
        { status: 400 }
      );
    }

    // Verify user has access to this integration
    const integration = await IntegrationService.getById(params.id);
    if (!integration) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 }
      );
    }
    if (integration.organization_id !== organizationId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await IntegrationService.delete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error deleting integration:", error);
    return NextResponse.json(
      { error: "Failed to delete integration" },
      { status: 500 }
    );
  }
}

