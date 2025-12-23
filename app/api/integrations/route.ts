import { NextResponse } from "next/server";

export interface Integration {
  id: string;
  name: string;
  category: string;
  connected: boolean;
}

const mockIntegrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    category: "communication",
    connected: true,
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    category: "alerting",
    connected: true,
  },
  {
    id: "opsgenie",
    name: "Opsgenie",
    category: "alerting",
    connected: false,
  },
  {
    id: "datadog",
    name: "Datadog",
    category: "observability",
    connected: false,
  },
  {
    id: "grafana",
    name: "Grafana",
    category: "observability",
    connected: false,
  },
  {
    id: "cloudwatch",
    name: "CloudWatch",
    category: "observability",
    connected: false,
  },
];

export async function GET() {
  return NextResponse.json(mockIntegrations);
}

export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Implement integration connection
  return NextResponse.json(
    { ...body, connected: true },
    { status: 201 }
  );
}

