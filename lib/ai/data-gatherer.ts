/**
 * Data gatherer - Fetches logs and metrics from observability tools
 */

import { getIntegrations } from "@/lib/db/queries/integrations";
import { decryptConfig } from "@/lib/api/integrations/encryption";

export interface InvestigationData {
  logs: string[];
  metrics: Record<string, unknown>;
  recentDeployments: string[];
}

/**
 * Gather investigation data from connected observability tools
 */
export async function gatherInvestigationData(
  organizationId: string,
  service: string,
  timeRange: { start: Date; end: Date } = {
    start: new Date(Date.now() - 60 * 60 * 1000), // Last hour
    end: new Date(),
  },
  incidentTitle?: string
): Promise<InvestigationData> {
  const integrations = await getIntegrations(organizationId);
  const observabilityIntegrations = integrations.filter(
    (integration) =>
      integration.category === "observability" && integration.connected
  );

  const data: InvestigationData = {
    logs: [],
    metrics: {},
    recentDeployments: [],
  };

  // If no integrations, generate mock data for testing
  if (observabilityIntegrations.length === 0) {
    data.logs = generateMockLogs(service, incidentTitle || "Incident", timeRange);
    data.metrics = generateMockMetrics(service, incidentTitle || "Incident");
    data.recentDeployments = [
      `Deployment to ${service} - ${new Date(timeRange.start.getTime() - 2 * 60 * 60 * 1000).toISOString()}`,
      `Config update for ${service} - ${new Date(timeRange.start.getTime() - 1 * 60 * 60 * 1000).toISOString()}`,
    ];
    return data;
  }

  // Fetch data from each connected observability tool
  for (const integration of observabilityIntegrations) {
    const config = decryptConfig(integration.config);

    try {
      switch (integration.type) {
        case "datadog":
          const datadogData = await fetchDatadogData(
            config,
            service,
            timeRange,
            incidentTitle
          );
          data.logs.push(...datadogData.logs);
          Object.assign(data.metrics, datadogData.metrics);
          break;

        case "grafana":
          const grafanaData = await fetchGrafanaData(
            config,
            service,
            timeRange
          );
          data.logs.push(...grafanaData.logs);
          Object.assign(data.metrics, grafanaData.metrics);
          break;

        case "cloudwatch":
          const cloudwatchData = await fetchCloudWatchData(
            config,
            service,
            timeRange
          );
          data.logs.push(...cloudwatchData.logs);
          Object.assign(data.metrics, cloudwatchData.metrics);
          break;
      }
    } catch (error) {
      console.error(`Error fetching data from ${integration.type}:`, error);
      // Continue with other integrations
    }
  }

  // If no data was gathered, use mock data as fallback
  if (data.logs.length === 0 && Object.keys(data.metrics).length === 0) {
    data.logs = generateMockLogs(service, incidentTitle || "Incident", timeRange);
    data.metrics = generateMockMetrics(service, incidentTitle || "Incident");
  }

  return data;
}

/**
 * Generate contextual mock logs based on incident details
 */
function generateMockLogs(service: string, title: string, timeRange: { start: Date; end: Date }): string[] {
  const logs: string[] = [];
  const startTime = timeRange.start;
  const endTime = timeRange.end;
  const duration = endTime.getTime() - startTime.getTime();
  const logCount = Math.min(20, Math.max(5, Math.floor(duration / 60000))); // 1 log per minute, max 20

  // Generate logs based on incident title keywords
  const titleLower = title.toLowerCase();
  const isTimeout = titleLower.includes("timeout") || titleLower.includes("connection");
  const isError = titleLower.includes("error") || titleLower.includes("500") || titleLower.includes("fail");
  const isLatency = titleLower.includes("latency") || titleLower.includes("slow") || titleLower.includes("spike");
  const isMemory = titleLower.includes("memory") || titleLower.includes("oom");
  const isDatabase = titleLower.includes("database") || titleLower.includes("db") || service.includes("db");

  for (let i = 0; i < logCount; i++) {
    const logTime = new Date(startTime.getTime() + (duration / logCount) * i);
    const timestamp = logTime.toISOString();

    if (isTimeout) {
      logs.push(`[${timestamp}] ERROR: ${service} - Connection timeout after 30s`);
      logs.push(`[${timestamp}] WARN: ${service} - Connection pool exhausted, waiting for available connection`);
    } else if (isError) {
      logs.push(`[${timestamp}] ERROR: ${service} - HTTP 500 Internal Server Error: ${title}`);
      logs.push(`[${timestamp}] ERROR: ${service} - Exception in request handler: java.lang.NullPointerException`);
    } else if (isLatency) {
      logs.push(`[${timestamp}] WARN: ${service} - Request latency exceeded threshold: 2.5s (threshold: 500ms)`);
      logs.push(`[${timestamp}] INFO: ${service} - Slow query detected: SELECT * FROM users WHERE ... (1.8s)`);
    } else if (isMemory) {
      logs.push(`[${timestamp}] ERROR: ${service} - OutOfMemoryError: Java heap space`);
      logs.push(`[${timestamp}] WARN: ${service} - Memory usage critical: 95% (threshold: 80%)`);
    } else if (isDatabase) {
      logs.push(`[${timestamp}] ERROR: ${service} - Database connection failed: Connection refused`);
      logs.push(`[${timestamp}] WARN: ${service} - Query timeout: SELECT query exceeded 30s limit`);
    } else {
      // Generic logs
      logs.push(`[${timestamp}] ERROR: ${service} - ${title}`);
      logs.push(`[${timestamp}] WARN: ${service} - Anomaly detected in service metrics`);
    }
  }

  return logs.slice(0, 50); // Limit to 50 logs
}

/**
 * Generate contextual mock metrics based on incident details
 */
function generateMockMetrics(service: string, title: string): Record<string, unknown> {
  const titleLower = title.toLowerCase();
  const isTimeout = titleLower.includes("timeout") || titleLower.includes("connection");
  const isError = titleLower.includes("error") || titleLower.includes("500") || titleLower.includes("fail");
  const isLatency = titleLower.includes("latency") || titleLower.includes("slow") || titleLower.includes("spike");
  const isMemory = titleLower.includes("memory") || titleLower.includes("oom");
  const isDatabase = titleLower.includes("database") || titleLower.includes("db") || service.includes("db");

  const baseMetrics: Record<string, unknown> = {
    cpu_usage: 45,
    memory_usage: 60,
    error_rate: 0.01,
    request_rate: 100,
    p95_latency: 200,
  };

  if (isTimeout) {
    return {
      ...baseMetrics,
      connection_pool_utilization: 98,
      connection_timeout_rate: 0.25,
      active_connections: 950,
      max_connections: 1000,
    };
  } else if (isError) {
    return {
      ...baseMetrics,
      error_rate: 0.18,
      http_5xx_rate: 0.15,
      cpu_usage: 85,
      exception_count: 1250,
    };
  } else if (isLatency) {
    return {
      ...baseMetrics,
      p95_latency: 2500,
      p99_latency: 5000,
      request_rate: 150,
      cpu_usage: 75,
    };
  } else if (isMemory) {
    return {
      ...baseMetrics,
      memory_usage: 95,
      heap_usage: 92,
      gc_frequency: 15,
      cpu_usage: 80,
    };
  } else if (isDatabase) {
    return {
      ...baseMetrics,
      db_connection_pool: 95,
      query_timeout_rate: 0.12,
      slow_query_count: 45,
      cpu_usage: 70,
    };
  }

  return baseMetrics;
}

/**
 * Fetch data from Datadog
 */
async function fetchDatadogData(
  config: Record<string, unknown>,
  service: string,
  timeRange: { start: Date; end: Date },
  incidentTitle?: string
): Promise<{ logs: string[]; metrics: Record<string, unknown> }> {
  const apiKey = config.api_key as string;
  const appKey = config.app_key as string;

  if (!apiKey || !appKey) {
    throw new Error("Datadog API credentials not configured");
  }

  // TODO: Implement actual Datadog API calls
  // For now, return contextual mock data
  return {
    logs: generateMockLogs(service, incidentTitle || "Incident", timeRange),
    metrics: generateMockMetrics(service, incidentTitle || "Incident"),
  };
}

/**
 * Fetch data from Grafana
 */
async function fetchGrafanaData(
  config: Record<string, unknown>,
  service: string,
  timeRange: { start: Date; end: Date }
): Promise<{ logs: string[]; metrics: Record<string, unknown> }> {
  const apiKey = config.api_key as string;
  const baseUrl = config.base_url as string;

  if (!apiKey || !baseUrl) {
    throw new Error("Grafana API credentials not configured");
  }

  // TODO: Implement actual Grafana API calls
  return {
    logs: [],
    metrics: {},
  };
}

/**
 * Fetch data from CloudWatch
 */
async function fetchCloudWatchData(
  config: Record<string, unknown>,
  service: string,
  timeRange: { start: Date; end: Date }
): Promise<{ logs: string[]; metrics: Record<string, unknown> }> {
  const accessKeyId = config.access_key_id as string;
  const secretAccessKey = config.secret_access_key as string;
  const region = (config.region as string) || "us-east-1";

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("CloudWatch credentials not configured");
  }

  // TODO: Implement actual CloudWatch API calls
  return {
    logs: [],
    metrics: {},
  };
}

