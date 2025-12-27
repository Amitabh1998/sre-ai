/**
 * Alert webhook handler - processes incoming alerts and creates incidents
 */

import { parsePagerDutyWebhook } from "../parsers/pagerduty";
import { parseOpsgenieWebhook } from "../parsers/opsgenie";
import { parseDatadogWebhook } from "../parsers/datadog";
import { IncidentService } from "@/lib/api/incidents/service";
import type { ParsedAlert } from "../parsers/pagerduty";

export interface AlertWebhookPayload {
  provider: "pagerduty" | "opsgenie" | "datadog" | "generic";
  payload: unknown;
  organizationId: string;
}

/**
 * Detect webhook provider from payload structure
 */
function detectProvider(payload: unknown): "pagerduty" | "opsgenie" | "datadog" | "generic" {
  const p = payload as Record<string, unknown>;

  if (p.incident || p.event?.incident) {
    return "pagerduty";
  }
  if (p.alert || p.incident) {
    // Check for Opsgenie-specific fields
    if (p.action || (p.alert && typeof p.alert === "object" && "priority" in p.alert)) {
      return "opsgenie";
    }
  }
  if (p.event || p.alert) {
    // Check for Datadog-specific fields
    if (
      (p.event && typeof p.event === "object" && "alert_type" in p.event) ||
      (p.alert && typeof p.alert === "object" && "date_happened" in p.alert)
    ) {
      return "datadog";
    }
  }

  return "generic";
}

/**
 * Parse alert webhook based on provider
 */
function parseAlertWebhook(
  provider: string,
  payload: unknown
): ParsedAlert {
  switch (provider) {
    case "pagerduty":
      return parsePagerDutyWebhook(payload as Parameters<typeof parsePagerDutyWebhook>[0]);
    case "opsgenie":
      return parseOpsgenieWebhook(payload as Parameters<typeof parseOpsgenieWebhook>[0]);
    case "datadog":
      return parseDatadogWebhook(payload as Parameters<typeof parseDatadogWebhook>[0]);
    default:
      // Generic fallback parser
      const p = payload as Record<string, unknown>;
      return {
        title: (p.title as string) || (p.message as string) || "Untitled Alert",
        service: (p.service as string) || (p.source as string) || "unknown-service",
        severity: "P2",
        description: (p.description as string) || undefined,
        metadata: { raw_payload: payload },
      };
  }
}

/**
 * Process alert webhook and create incident
 */
export async function handleAlertWebhook(
  organizationId: string,
  payload: unknown,
  provider?: "pagerduty" | "opsgenie" | "datadog" | "generic"
): Promise<{ incidentId: string; created: boolean }> {
  // Detect provider if not specified
  const detectedProvider = provider || detectProvider(payload);

  // Parse webhook payload
  const parsedAlert = parseAlertWebhook(detectedProvider, payload);

  // Create incident
  const incident = await IncidentService.create(organizationId, {
    title: parsedAlert.title,
    service: parsedAlert.service,
    severity: parsedAlert.severity,
    status: "ai-investigating", // Trigger AI investigation
    description: parsedAlert.description,
    metadata: {
      ...parsedAlert.metadata,
      provider: detectedProvider,
      webhook_received_at: new Date().toISOString(),
    },
  });

  // Create timeline event for alert received
  await IncidentService.addTimelineEvent(incident.id, {
    type: "alert",
    title: `Alert received from ${detectedProvider}`,
    description: `Alert webhook processed and incident created`,
    metadata: {
      provider: detectedProvider,
    },
  });

  return {
    incidentId: incident.id,
    created: true,
  };
}

