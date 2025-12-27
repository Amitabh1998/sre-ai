import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { DashboardService } from "@/lib/api/dashboard/service";
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

    const metrics = await DashboardService.getMetrics(organizationId);
    return NextResponse.json(metrics);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching dashboard metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}

