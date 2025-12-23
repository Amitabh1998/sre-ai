import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { IncidentCard, type Incident } from "@/components/features/IncidentCard";
import { AIActivityFeed, type AIActivity } from "@/components/features/AIActivityFeed";
import { MetricCard } from "@/components/features/MetricCard";
import Link from "next/link";

const metrics = [
  {
    label: "Total Incidents",
    value: "47",
    change: "3%",
    trend: "up" as const,
    icon: "list",
  },
  {
    label: "Avg MTTR",
    value: "12m",
    change: "15%",
    trend: "down" as const,
    icon: "info",
  },
  {
    label: "AI Investigations",
    value: "142",
    badge: "98% Success",
    icon: "home",
  },
  {
    label: "On-Call Health",
    value: "92%",
    status: "Stable",
    icon: "monitor_heart",
  },
];

const recentIncidents: Incident[] = [
  {
    id: "INC-001",
    title: "DB Connection Timeout",
    service: "checkout-db",
    severity: "P1",
    status: "ai-investigating",
    mttr: null,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "INC-002",
    title: "API Latency Spike",
    service: "payment-gateway",
    severity: "P2",
    status: "human-intervention",
    mttr: null,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "INC-003",
    title: "Redis Cache Miss",
    service: "redis-cluster-01",
    severity: "P3",
    status: "resolved",
    mttr: "4m 12s",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "INC-004",
    title: "Pod Restart",
    service: "notification-svc",
    severity: "P3",
    status: "auto-healed",
    mttr: "45s",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "INC-005",
    title: "Log Rotation Warning",
    service: "logging-agent",
    severity: "P4",
    status: "resolved",
    mttr: "1m 20s",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

const aiActivities: AIActivity[] = [
  {
    id: "1",
    title: "Investigating Latency",
    timestamp: new Date().toISOString(),
    type: "investigating",
    description:
      "Analyzing checkout-db logs for anomalies matching error pattern #8291.",
    details: [
      "scanning_logs: 12.4k lines",
      "anomaly_detected: true",
    ],
    isLive: true,
  },
  {
    id: "2",
    title: "Resolved Incident",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    type: "resolved",
    description:
      "Cleared cache on redis-cluster-01. Metrics returned to baseline.",
  },
  {
    id: "3",
    title: "Healed Pod",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    type: "healed",
    description: "Restarted unresponsive pod in notification-svc.",
  },
  {
    id: "4",
    title: "Health Check",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    type: "health-check",
    description: "Routine system scan completed. All systems green.",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Incidents</CardTitle>
              <Link
                href="/dashboard/incidents"
                className="text-sm text-primary hover:underline"
              >
                View All
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SEVERITY</TableHead>
                    <TableHead>INCIDENT</TableHead>
                    <TableHead>SERVICE</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>MTTR</TableHead>
                    <TableHead>TIME</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentIncidents.map((incident) => (
                    <IncidentCard key={incident.id} incident={incident} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <AIActivityFeed activities={aiActivities} />
        </div>
      </div>
    </div>
  );
}

