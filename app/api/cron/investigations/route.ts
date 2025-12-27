import { NextResponse } from "next/server";
import { processInvestigationJob } from "@/lib/jobs/investigation-job";
import { createServiceClient } from "@/lib/supabase/server";
import type { NextRequest } from "next/server";

/**
 * Cron endpoint for processing pending investigations
 * Configure in Vercel: https://vercel.com/docs/cron-jobs
 */
export async function GET(req: NextRequest) {
  // Verify cron secret (if configured)
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    // Find incidents that need investigation
    const { data: incidents, error } = await supabase
      .from("incidents")
      .select("id")
      .eq("status", "ai-investigating")
      .order("created_at", { ascending: true })
      .limit(10);

    if (error) {
      throw error;
    }

    if (!incidents || incidents.length === 0) {
      return NextResponse.json({ message: "No incidents to investigate" });
    }

    // Process investigations (in production, use a proper job queue)
    const results = await Promise.allSettled(
      incidents.map((incident) => processInvestigationJob(incident.id))
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      processed: incidents.length,
      successful,
      failed,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Failed to process investigations" },
      { status: 500 }
    );
  }
}

