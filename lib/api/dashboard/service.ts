/**
 * Dashboard aggregation service
 */

import { createClient } from "@/lib/supabase/server";
import type { Metric, AIActivity } from "@/lib/types";
import type { AIActivity as DBAIActivity } from "@/lib/db/types";

export class DashboardService {
  /**
   * Get dashboard metrics
   */
  static async getMetrics(organizationId: string): Promise<Metric[]> {
    const supabase = await createClient();

    // Get total incidents count
    const { count: totalIncidents } = await supabase
      .from("incidents")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId);

    // Get resolved incidents for MTTR calculation
    const { data: resolvedIncidents } = await supabase
      .from("incidents")
      .select("created_at, resolved_at, mttr")
      .eq("organization_id", organizationId)
      .eq("status", "resolved")
      .not("resolved_at", "is", null);

    // Calculate average MTTR
    let avgMTTR = "0m";
    if (resolvedIncidents && resolvedIncidents.length > 0) {
      const mttrValues = resolvedIncidents
        .filter((inc) => inc.mttr)
        .map((inc) => {
          // Parse MTTR string like "8 min" to minutes
          const match = inc.mttr?.match(/(\d+)\s*(min|m|hour|h)/);
          if (match) {
            const value = parseInt(match[1], 10);
            const unit = match[2];
            return unit.includes("h") ? value * 60 : value;
          }
          return 0;
        });

      if (mttrValues.length > 0) {
        const avgMinutes = Math.round(
          mttrValues.reduce((a, b) => a + b, 0) / mttrValues.length
        );
        avgMTTR = `${avgMinutes}m`;
      }
    }

    // Get AI investigations count
    const { count: aiInvestigations } = await supabase
      .from("incidents")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .in("status", ["ai-investigating", "auto-healed"]);

    // Calculate success rate (auto-healed vs total AI investigations)
    const { count: autoHealed } = await supabase
      .from("incidents")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("status", "auto-healed");

    const successRate =
      aiInvestigations && aiInvestigations > 0
        ? Math.round((autoHealed || 0) / aiInvestigations) * 100
        : 0;

    // Calculate on-call health (percentage of incidents resolved within SLA)
    // For now, we'll use a simple calculation
    const onCallHealth = 92; // Placeholder - would calculate based on SLA compliance

    return [
      {
        label: "Total Incidents",
        value: String(totalIncidents || 0),
        change: "3%",
        trend: "up" as const,
        icon: "list",
      },
      {
        label: "Avg MTTR",
        value: avgMTTR,
        change: "15%",
        trend: "down" as const,
        icon: "info",
      },
      {
        label: "AI Investigations",
        value: String(aiInvestigations || 0),
        badge: `${successRate}% Success`,
        icon: "home",
      },
      {
        label: "On-Call Health",
        value: `${onCallHealth}%`,
        status: "Stable",
        icon: "monitor_heart",
      },
    ];
  }

  /**
   * Get recent AI activities
   */
  static async getAIActivities(
    organizationId: string,
    limit: number = 10
  ): Promise<AIActivity[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("ai_activities")
      .select("*")
      .eq("organization_id", organizationId)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch AI activities: ${error.message}`);
    }

    return (data || []).map((activity: DBAIActivity) => ({
      id: activity.id,
      title: activity.title,
      timestamp: activity.timestamp,
      type: activity.type,
      description: activity.description,
      details: activity.details,
      isLive: activity.is_live,
    }));
  }
}

