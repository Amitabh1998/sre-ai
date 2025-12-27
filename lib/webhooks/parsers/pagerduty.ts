/**
 * PagerDuty webhook parser
 */

export interface PagerDutyWebhook {
  event?: {
    event_type?: string;
    incident?: {
      id?: string;
      title?: string;
      status?: string;
      severity?: string;
      service?: {
        name?: string;
      };
      created_at?: string;
      description?: string;
    };
  };
  incident?: {
    id?: string;
    title?: string;
    status?: string;
    severity?: string;
    service?: {
      name?: string;
    };
    created_at?: string;
    description?: string;
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
 * Parse PagerDuty webhook payload
 */
export function parsePagerDutyWebhook(payload: PagerDutyWebhook): ParsedAlert {
  const incident = payload.incident || payload.event?.incident;

  if (!incident) {
    throw new Error("Invalid PagerDuty webhook: missing incident data");
  }

  // Map PagerDuty severity to our severity levels
  const severityMap: Record<string, "P1" | "P2" | "P3" | "P4"> = {
    critical: "P1",
    error: "P1",
    warning: "P2",
    info: "P3",
    low: "P4",
  };

  const severity =
    severityMap[incident.severity?.toLowerCase() || ""] || "P2";

  return {
    title: incident.title || "Untitled Incident",
    service: incident.service?.name || "unknown-service",
    severity,
    description: incident.description || undefined,
    metadata: {
      pagerduty_incident_id: incident.id,
      pagerduty_status: incident.status,
      pagerduty_severity: incident.severity,
      pagerduty_created_at: incident.created_at,
      raw_payload: payload,
    },
  };
}

