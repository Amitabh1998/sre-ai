import { NextResponse } from "next/server";

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: "P1" | "P2" | "P3";
  status: "active" | "investigating" | "resolved";
  mttr: string | null;
  createdAt: string;
}

const mockIncidents: Incident[] = [
  {
    id: "INC-2847",
    title: "Payment API 500 errors",
    service: "payment-service",
    severity: "P1",
    status: "resolved",
    mttr: "8 min",
    createdAt: "2024-12-22T03:42:00Z",
  },
  {
    id: "INC-2846",
    title: "High latency in checkout",
    service: "checkout-api",
    severity: "P2",
    status: "investigating",
    mttr: null,
    createdAt: "2024-12-22T08:15:00Z",
  },
  {
    id: "INC-2845",
    title: "Database connection pool exhausted",
    service: "user-service",
    severity: "P2",
    status: "resolved",
    mttr: "15 min",
    createdAt: "2024-12-22T01:30:00Z",
  },
];

export async function GET() {
  return NextResponse.json(mockIncidents);
}

export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Implement incident creation
  return NextResponse.json(
    { id: `INC-${Date.now()}`, ...body },
    { status: 201 }
  );
}

