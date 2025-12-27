import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { IncidentService } from "@/lib/api/incidents/service";
import { createIncidentSchema } from "@/lib/api/incidents/validators";
import { getCurrentUserOrganizationId } from "@/lib/db/queries/users";
import { investigateIncident } from "@/lib/ai/investigation-service";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return withAuth(async (req: NextRequest, user) => {
    try {
      // Use the user passed from withAuth instead of trying to get from session
      const organizationId = user.organization_id || await getCurrentUserOrganizationId();
      if (!organizationId) {
        return NextResponse.json(
          { error: "User not associated with an organization" },
          { status: 400 }
        );
      }

      // Parse query parameters
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1", 10);
      const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
      const sortBy = searchParams.get("sortBy") || "created_at";
      const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

      const filters = {
        severity: searchParams.get("severity") || undefined,
        status: searchParams.get("status") || undefined,
        service: searchParams.get("service") || undefined,
      };

      const result = await IncidentService.getAll(
        organizationId,
        { page, pageSize, sortBy, sortOrder },
        filters
      );

      return NextResponse.json(result);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      return NextResponse.json(
        { error: "Failed to fetch incidents" },
        { status: 500 }
      );
    }
  })(req);
}

export async function POST(req: NextRequest) {
  return withAuth(async (req: NextRequest, user) => {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/route.ts:52',message:'POST handler entry',data:{userId:user.id,userEmail:user.email,userOrgId:user.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      
      // Use the user passed from withAuth instead of trying to get from session
      // This works for both real auth and mock auth in dev mode
      const organizationId = user.organization_id || await getCurrentUserOrganizationId();
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/route.ts:56',message:'Organization ID check',data:{organizationId,fromUser:!!user.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      
      if (!organizationId) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/route.ts:60',message:'No organization ID - returning 400',data:{userId:user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
        // #endregion
        return NextResponse.json(
          { error: "User not associated with an organization" },
          { status: 400 }
        );
      }

      const body = await req.json();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/route.ts:64',message:'Parsing request body',data:{bodyKeys:Object.keys(body)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
      
      const validatedData = createIncidentSchema.parse(body);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/route.ts:67',message:'Validation passed, creating incident',data:{title:validatedData.title,service:validatedData.service,severity:validatedData.severity},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion

      const incident = await IncidentService.create(organizationId, validatedData);
      console.log('[POST /api/incidents] Incident created:', {
        incidentId: incident.id,
        title: incident.title,
        organizationId: incident.organization_id,
        status: incident.status,
      });
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/route.ts:70',message:'Incident created successfully',data:{incidentId:incident.id,status:incident.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion

      // Verify the incident can be fetched immediately (for debugging)
      const verifyIncident = await IncidentService.getById(incident.id);
      if (!verifyIncident) {
        console.error('[POST /api/incidents] WARNING: Created incident cannot be fetched immediately!', {
          createdId: incident.id,
          organizationId: incident.organization_id,
        });
      } else {
        console.log('[POST /api/incidents] Verified incident can be fetched:', {
          incidentId: verifyIncident.id,
          organizationId: verifyIncident.organization_id,
        });
      }

      // Auto-trigger investigation if status is ai-investigating
      if (incident.status === "ai-investigating") {
        // Trigger investigation asynchronously (don't await)
        // This allows the API to return immediately while investigation runs in background
        console.log(`[POST /api/incidents] Auto-triggering investigation for incident ${incident.id}`);
        investigateIncident(incident.id)
          .then((result) => {
            console.log(`[POST /api/incidents] Investigation completed successfully for incident ${incident.id}:`, {
              hypothesesCount: result.hypotheses.length,
              status: result.status,
            });
          })
          .catch((error) => {
            console.error(`[POST /api/incidents] Investigation failed for incident ${incident.id}:`, error);
            console.error(`[POST /api/incidents] Error stack:`, error instanceof Error ? error.stack : undefined);
            console.error(`[POST /api/incidents] Error details:`, {
              name: error instanceof Error ? error.name : 'unknown',
              message: error instanceof Error ? error.message : String(error),
            });
          });
      }

      return NextResponse.json(incident, { status: 201 });
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/route.ts:85',message:'Error caught in POST handler',data:{errorName:error instanceof Error ? error.name : 'unknown',errorMessage:error instanceof Error ? error.message : String(error),isZodError:error instanceof Error && error.name === 'ZodError'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
      // #endregion
      
      if (error instanceof Error && error.name === "ZodError") {
        return NextResponse.json(
          { error: "Validation error", details: error },
          { status: 400 }
        );
      }
      console.error("Error creating incident:", error);
      return NextResponse.json(
        { error: "Failed to create incident" },
        { status: 500 }
      );
    }
  })(req);
}
