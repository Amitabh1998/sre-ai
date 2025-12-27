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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const activities = await DashboardService.getAIActivities(
      organizationId,
      limit
    );
    return NextResponse.json(activities);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching AI activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI activities" },
      { status: 500 }
    );
  }
}

