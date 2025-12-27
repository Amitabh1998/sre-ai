/**
 * Opsgenie webhook parser
 */

export interface OpsgenieWebhook {
  action?: string;
  alert?: {
    id?: string;
    message?: string;
    alias?: string;
    description?: string;
    priority?: string;
    source?: string;
    createdAt?: string;
    tags?: string[];
  };
  incident?: {
    id?: string;
    name?: string;
    description?: string;
    priority?: string;
    createdAt?: string;
  };
}

export interface ParsedAlert {
  title: string;
  service: string;
  severity: "P1" | "P2" | "P3" | "P4";
  description?: string;
  metadata: Record<string, unknown>;
}

/**
 * Parse Opsgenie webhook payload
 */
export function parseOpsgenieWebhook(payload: OpsgenieWebhook): ParsedAlert {
  const alert = payload.alert || payload.incident;

  if (!alert) {
    throw new Error("Invalid Opsgenie webhook: missing alert/incident data");
  }

  // Map Opsgenie priority to our severity levels
  const severityMap: Record<string, "P1" | "P2" | "P3" | "P4"> = {
    P1: "P1",
    P2: "P2",
    P3: "P3",
    P4: "P4",
    critical: "P1",
    high: "P2",
    moderate: "P3",
    low: "P4",
  };

  const priority = alert.priority || "P3";
  const severity = severityMap[priority] || "P2";

  // Extract service name from tags or source
  const serviceTag = alert.tags?.find((tag) => tag.startsWith("service:"));
  const service = serviceTag
    ? serviceTag.replace("service:", "")
    : alert.source || "unknown-service";

  return {
    title: alert.message || alert.name || "Untitled Alert",
    service,
    severity,
    description: alert.description || undefined,
    metadata: {
      opsgenie_alert_id: alert.id,
      opsgenie_priority: priority,
      opsgenie_source: alert.source,
      opsgenie_tags: alert.tags,
      opsgenie_created_at: alert.createdAt,
      raw_payload: payload,
    },
  };
}

