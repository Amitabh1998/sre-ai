import { NextResponse } from "next/server";

const mockIncident = {
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // TODO: Fetch incident by ID from database
  return NextResponse.json(mockIncident);
}

