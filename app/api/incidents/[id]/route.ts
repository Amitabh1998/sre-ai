import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { IncidentService } from "@/lib/api/incidents/service";
import { updateIncidentSchema } from "@/lib/api/incidents/validators";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: NextRequest, user, context: { params: { id: string } }) => {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/route.ts:11',message:'GET handler ENTRY',data:{incidentId:context.params.id,userId:user.id,userEmail:user.email,userOrgId:user.organization_id,incidentIdType:typeof context.params.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      console.log('[GET /api/incidents/[id]] Handler called', { 
        incidentId: context.params.id, 
        userId: user.id, 
        userEmail: user.email,
        userOrgId: user.organization_id 
      });
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/route.ts:20',message:'BEFORE IncidentService.getById',data:{incidentId:context.params.id,userOrgId:user.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      const incident = await IncidentService.getById(context.params.id);
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/route.ts:24',message:'AFTER IncidentService.getById',data:{foundIncident:!!incident,incidentId:incident?.id,incidentOrgId:incident?.organization_id,incidentTitle:incident?.title,requestedId:context.params.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      console.log('[GET /api/incidents/[id]] Incident fetched', { 
        found: !!incident, 
        incidentId: incident?.id, 
        incidentOrgId: incident?.organization_id,
        incidentTitle: incident?.title
      });

      if (!incident) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/route.ts:32',message:'RETURNING 404 - incident not found',data:{incidentId:context.params.id,userId:user.id,userOrgId:user.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        console.log('[GET /api/incidents/[id]] Incident not found - returning 404', {
          incidentId: context.params.id,
          userId: user.id,
          userOrgId: user.organization_id,
        });
        return NextResponse.json(
          { 
            error: "Incident not found",
            incidentId: context.params.id,
            message: `No incident found with ID ${context.params.id}. This could mean the incident doesn't exist or belongs to a different organization.`
          },
          { status: 404 }
        );
      }

      // Verify user has access to this incident's organization
      // Use the user passed from withAuth - it already has organization_id set
      const organizationId = user.organization_id;
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/route.ts:50',message:'Organization check',data:{userOrgId:organizationId,incidentOrgId:incident.organization_id,match:incident.organization_id === organizationId,userOrgIdType:typeof organizationId,incidentOrgIdType:typeof incident.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      console.log('[GET /api/incidents/[id]] Organization check', { userOrgId: organizationId, incidentOrgId: incident.organization_id, match: incident.organization_id === organizationId });
      
      if (!organizationId) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/route.ts:54',message:'RETURNING 400 - user has no org',data:{userId:user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        
        console.log('[GET /api/incidents/[id]] User has no organization_id');
        return NextResponse.json(
          { error: "User not associated with an organization" },
          { status: 400 }
        );
      }
      
      if (incident.organization_id !== organizationId) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/route.ts:61',message:'RETURNING 403 - org mismatch',data:{userOrgId:organizationId,incidentOrgId:incident.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        
        console.log('[GET /api/incidents/[id]] Unauthorized - organization mismatch', { 
          userOrgId: organizationId, 
          incidentOrgId: incident.organization_id 
        });
        return NextResponse.json(
          { error: "Unauthorized - incident belongs to a different organization" },
          { status: 403 }
        );
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/route.ts:70',message:'RETURNING 200 - success',data:{incidentId:incident.id,incidentOrgId:incident.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      console.log('[GET /api/incidents/[id]] Returning incident successfully');
      return NextResponse.json(incident);
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/incidents/[id]/route.ts:37',message:'Error in GET handler',data:{errorName:error instanceof Error ? error.name : 'unknown',errorMessage:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'M'})}).catch(()=>{});
      // #endregion
      console.error("Error fetching incident:", error);
      return NextResponse.json(
        { error: "Failed to fetch incident" },
        { status: 500 }
      );
    }
  })(req, { params });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: NextRequest, user, context: { params: { id: string } }) => {
    try {
      const organizationId = user.organization_id;
      if (!organizationId) {
        return NextResponse.json(
          { error: "User not associated with an organization" },
          { status: 400 }
        );
      }

      // Verify user has access to this incident
      const existingIncident = await IncidentService.getById(context.params.id);
      if (!existingIncident) {
        return NextResponse.json(
          { error: "Incident not found" },
          { status: 404 }
        );
      }
      if (existingIncident.organization_id !== organizationId) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }

      const body = await req.json();
      const validatedData = updateIncidentSchema.parse(body);

      const incident = await IncidentService.update(context.params.id, validatedData);

      // Create timeline event if status changed
      if (validatedData.status && validatedData.status !== existingIncident.status) {
        await IncidentService.addTimelineEvent(context.params.id, {
          type: "action",
          title: `Status changed to ${validatedData.status}`,
          description: `Incident status updated from ${existingIncident.status} to ${validatedData.status}`,
        });
      }

      return NextResponse.json(incident);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return NextResponse.json(
          { error: "Validation error", details: error },
          { status: 400 }
        );
      }
      console.error("Error updating incident:", error);
      return NextResponse.json(
        { error: "Failed to update incident" },
        { status: 500 }
      );
    }
  })(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: NextRequest, user, context: { params: { id: string } }) => {
    try {
      const organizationId = user.organization_id;
      if (!organizationId) {
        return NextResponse.json(
          { error: "User not associated with an organization" },
          { status: 400 }
        );
      }

      // Verify user has access to this incident
      const existingIncident = await IncidentService.getById(context.params.id);
      if (!existingIncident) {
        return NextResponse.json(
          { error: "Incident not found" },
          { status: 404 }
        );
      }
      if (existingIncident.organization_id !== organizationId) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }

      await IncidentService.delete(context.params.id);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting incident:", error);
      return NextResponse.json(
        { error: "Failed to delete incident" },
        { status: 500 }
      );
    }
  })(req, { params });
}
