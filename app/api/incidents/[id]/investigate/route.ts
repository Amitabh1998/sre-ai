import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { investigateIncident } from "@/lib/ai/investigation-service";
import { IncidentService } from "@/lib/api/incidents/service";
import type { NextRequest } from "next/server";

/**
 * POST /api/incidents/[id]/investigate
 * Manually trigger AI investigation for an incident
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: NextRequest, user, context: { params: { id: string } }) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/investigate/route.ts:15',message:'POST investigate handler ENTRY',data:{incidentId:context.params.id,userId:user.id,userOrgId:user.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    try {
      const incidentId = context.params.id;
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/investigate/route.ts:20',message:'BEFORE IncidentService.getById',data:{incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      // Verify user has access to this incident's organization
      const incident = await IncidentService.getById(incidentId);
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/investigate/route.ts:25',message:'AFTER IncidentService.getById',data:{incidentId,foundIncident:!!incident,incidentStatus:incident?.status,incidentOrgId:incident?.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      if (!incident) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/investigate/route.ts:28',message:'RETURNING 404 - incident not found',data:{incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        return NextResponse.json(
          { error: "Incident not found" },
          { status: 404 }
        );
      }

      // Use the user passed from withAuth instead of trying to get from session
      const organizationId = user.organization_id;
      if (!organizationId || incident.organization_id !== organizationId) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/investigate/route.ts:37',message:'RETURNING 403 - unauthorized',data:{incidentId,userOrgId:organizationId,incidentOrgId:incident.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        console.log(`[POST /api/incidents/[id]/investigate] Unauthorized:`, {
          userOrgId: organizationId,
          incidentOrgId: incident.organization_id,
        });
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }

      // Check if investigation is already in progress
      if (incident.status === "ai-investigating") {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/investigate/route.ts:48',message:'RETURNING 400 - investigation already in progress',data:{incidentId,status:incident.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        return NextResponse.json(
          { error: "Investigation already in progress" },
          { status: 400 }
        );
      }

      // Trigger investigation asynchronously
      // Don't await - let it run in the background
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/investigate/route.ts:55',message:'BEFORE investigateIncident call',data:{incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      
      console.log(`[POST /api/incidents/[id]/investigate] Triggering investigation for incident ${incidentId}`);
      investigateIncident(incidentId)
        .then((result) => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/investigate/route.ts:59',message:'Investigation completed successfully',data:{incidentId:result.incidentId,hypothesesCount:result.hypotheses.length,status:result.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          console.log(`[POST /api/incidents/[id]/investigate] Investigation completed successfully:`, {
            incidentId: result.incidentId,
            hypothesesCount: result.hypotheses.length,
            status: result.status,
          });
        })
        .catch((error) => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/investigate/route.ts:66',message:'Investigation failed',data:{incidentId,errorName:error instanceof Error ? error.name : 'unknown',errorMessage:error instanceof Error ? error.message : String(error),errorStack:error instanceof Error ? error.stack : undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          console.error(`[POST /api/incidents/[id]/investigate] Investigation failed for incident ${incidentId}:`, error);
          console.error(`[POST /api/incidents/[id]/investigate] Error stack:`, error instanceof Error ? error.stack : undefined);
        });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/investigate/route.ts:72',message:'RETURNING success - investigation started',data:{incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion

      return NextResponse.json({
        success: true,
        message: "Investigation started",
        incidentId,
      });
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/investigate/route.ts:78',message:'Error in POST handler',data:{errorName:error instanceof Error ? error.name : 'unknown',errorMessage:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.error("Error triggering investigation:", error);
      return NextResponse.json(
        {
          error: "Failed to trigger investigation",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  })(req, { params });
}

