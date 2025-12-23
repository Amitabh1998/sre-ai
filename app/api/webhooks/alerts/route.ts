import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Process incoming alert webhook
  // - Parse alert data
  // - Create incident
  // - Trigger AI investigation
  console.log("Received alert:", body);
  return NextResponse.json({ success: true });
}

