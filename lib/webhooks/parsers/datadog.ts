/**
 * Datadog webhook parser
 */

export interface DatadogWebhook {
  event?: {
    title?: string;
    text?: string;
    alert_type?: string;
    date_happened?: number;
    tags?: string[];
    host?: string;
    source?: string;
  };
  alert?: {
    title?: string;
    message?: string;
    severity?: string;
    date_happened?: number;
    tags?: string[];
    host?: string;
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
 * Parse Datadog webhook payload
 */
export function parseDatadogWebhook(payload: DatadogWebhook): ParsedAlert {
  const event = payload.event || payload.alert;

  if (!event) {
    throw new Error("Invalid Datadog webhook: missing event/alert data");
  }

  // Map Datadog alert type to our severity levels
  const severityMap: Record<string, "P1" | "P2" | "P3" | "P4"> = {
    error: "P1",
    warning: "P2",
    info: "P3",
    success: "P4",
  };

  const alertType = event.alert_type || event.severity || "warning";
  const severity = severityMap[alertType.toLowerCase()] || "P2";

  // Extract service name from tags or host
  const serviceTag = event.tags?.find((tag) => tag.startsWith("service:"));
  const service = serviceTag
    ? serviceTag.replace("service:", "")
    : event.host || event.source || "unknown-service";

  const timestamp = event.date_happened
    ? new Date(event.date_happened * 1000).toISOString()
    : new Date().toISOString();

  return {
    title: event.title || "Untitled Alert",
    service,
    severity,
    description: event.text || event.message || undefined,
    metadata: {
      datadog_alert_type: alertType,
      datadog_host: event.host,
      datadog_source: event.source,
      datadog_tags: event.tags,
      datadog_date_happened: timestamp,
      raw_payload: payload,
    },
  };
}

