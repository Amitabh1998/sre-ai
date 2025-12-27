/**
 * Debug endpoint to check incident status
 * This helps diagnose "incident not found" issues
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const incidentId = params.id;
    const supabase = createServiceClient();

    // Check if incident exists
    const { data: incident, error: incidentError } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", incidentId)
      .single();

    // Check all incidents to see what exists
    const { data: allIncidents, error: allError } = await supabase
      .from("incidents")
      .select("id, title, organization_id, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    // Check organizations
    const { data: orgs, error: orgError } = await supabase
      .from("organizations")
      .select("id, name, slug");

    return NextResponse.json({
      requestedId: incidentId,
      incident: incident
        ? {
            id: incident.id,
            title: incident.title,
            organization_id: incident.organization_id,
            status: incident.status,
            created_at: incident.created_at,
          }
        : null,
      incidentError: incidentError
        ? {
            code: incidentError.code,
            message: incidentError.message,
            details: incidentError.details,
            hint: incidentError.hint,
          }
        : null,
      allIncidents: allIncidents?.map((inc) => ({
        id: inc.id,
        title: inc.title,
        organization_id: inc.organization_id,
        created_at: inc.created_at,
      })) || [],
      organizations: orgs || [],
      errors: {
        allError: allError?.message,
        orgError: orgError?.message,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug endpoint failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

