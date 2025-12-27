import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { IntegrationService } from "@/lib/api/integrations/service";
import { connectIntegrationSchema } from "@/lib/api/integrations/dto";
import { getCurrentUserOrganizationId } from "@/lib/db/queries/users";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const organizationId = await getCurrentUserOrganizationId();
    if (!organizationId) {
      return NextResponse.json(
        { error: "User not associated with an organization" },
        { status: 400 }
      );
    }

    const integrations = await IntegrationService.getAll(organizationId);
    return NextResponse.json(integrations);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching integrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch integrations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const organizationId = await getCurrentUserOrganizationId();
    if (!organizationId) {
      return NextResponse.json(
        { error: "User not associated with an organization" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedData = connectIntegrationSchema.parse(body);

    const integration = await IntegrationService.create(
      organizationId,
      validatedData
    );

    return NextResponse.json(integration, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      );
    }
    console.error("Error creating integration:", error);
    return NextResponse.json(
      { error: "Failed to create integration" },
      { status: 500 }
    );
  }
}
