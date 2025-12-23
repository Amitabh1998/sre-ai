import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Timeline, type TimelineEvent } from "@/components/features/Timeline";
import { HypothesisCard, type Hypothesis } from "@/components/features/HypothesisCard";
import { format } from "date-fns";

const incident = {
  id: "INC-2847",
  title: "Payment API 500 errors",
  service: "payment-service",
  severity: "P1" as const,
  status: "resolved" as const,
  mttr: "8 min",
  createdAt: "2024-12-22T03:42:00Z",
  resolvedAt: "2024-12-22T03:50:00Z",
  description:
    "Payment API started returning 500 errors for approximately 8 minutes. Affected ~15% of payment requests during peak hours.",
};

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    timestamp: "2024-12-22T03:42:00Z",
    type: "alert",
    title: "Alert received",
    description: "PagerDuty alert: Payment API error rate > 5%",
  },
  {
    id: "2",
    timestamp: "2024-12-22T03:42:15Z",
    type: "investigation",
    title: "AI Agent started investigation",
    description: "Analyzing error logs and recent deployments",
  },
  {
    id: "3",
    timestamp: "2024-12-22T03:43:00Z",
    type: "action",
    title: "Root cause identified",
    description: "Memory leak in worker-node-04 causing OOM kills",
  },
  {
    id: "4",
    timestamp: "2024-12-22T03:45:00Z",
    type: "action",
    title: "Auto-remediation applied",
    description: "Restarted worker-node-04, traffic rerouted",
  },
  {
    id: "5",
    timestamp: "2024-12-22T03:50:00Z",
    type: "resolution",
    title: "Incident resolved",
    description: "All services healthy, error rate normalized",
  },
];

const hypotheses: Hypothesis[] = [
  {
    id: "1",
    title: "Memory leak in worker-node-04",
    confidence: 95,
    evidence: [
      "OOM kills detected in worker-node-04 logs at 03:41:32",
      "Memory usage spiked from 60% to 100% in 2 minutes",
      "Recent deployment to worker-node-04 at 03:15:00",
      "Error pattern matches previous memory leak incidents",
    ],
    suggestedFix:
      "Restart worker-node-04 and investigate the recent deployment for memory leaks. Consider rolling back if issue persists.",
  },
  {
    id: "2",
    title: "Database connection pool exhaustion",
    confidence: 45,
    evidence: [
      "High number of database connections observed",
      "Connection pool metrics show 95% utilization",
    ],
    suggestedFix:
      "Increase connection pool size or investigate connection leaks.",
  },
];

export default function IncidentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const severityVariant =
    incident.severity === "P1"
      ? "severity-p1"
      : incident.severity === "P2"
      ? "severity-p2"
      : "severity-p3";

  const statusVariant =
    incident.status === "resolved"
      ? "success"
      : incident.status === "investigating"
      ? "severity-p2"
      : "severity-p1";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge variant={severityVariant as any}>{incident.severity}</Badge>
            <h1 className="text-2xl font-bold text-white">{incident.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>{incident.service}</span>
            <span>•</span>
            <span>{format(new Date(incident.createdAt), "MMM d, yyyy 'at' HH:mm")}</span>
            {incident.mttr && (
              <>
                <span>•</span>
                <span>MTTR: {incident.mttr}</span>
              </>
            )}
          </div>
        </div>
        <Badge variant={statusVariant as any}>
          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="postmortem">Post-Mortem</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{incident.description}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-slate-400">Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-white">{incident.service}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-slate-400">Severity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={severityVariant as any}>{incident.severity}</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-slate-400">MTTR</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-white">{incident.mttr}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Incident Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline events={timelineEvents} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Hypotheses</CardTitle>
                <p className="text-sm text-slate-400 mt-2">
                  The AI agent analyzed logs, metrics, and recent changes to identify
                  potential root causes.
                </p>
              </CardHeader>
            </Card>
            {hypotheses.map((hypothesis) => (
              <HypothesisCard key={hypothesis.id} hypothesis={hypothesis} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="postmortem">
          <Card>
            <CardHeader>
              <CardTitle>Post-Mortem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Post-mortem documentation will be available after the incident review
                meeting.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

