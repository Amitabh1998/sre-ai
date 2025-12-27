/**
 * Database queries for incidents
 */

import { createClient } from "@/lib/supabase/server";
import type {
  Incident,
  TimelineEvent,
  Hypothesis,
  IncidentSeverity,
  IncidentStatus,
  TimelineEventType,
} from "@/lib/db/types";

export interface IncidentWithRelations extends Incident {
  timeline_events: TimelineEvent[];
  hypotheses: Hypothesis[];
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IncidentFilters {
  severity?: string;
  status?: string;
  service?: string;
}

export async function getIncidents(
  organizationId: string,
  params?: PaginationParams,
  filters?: IncidentFilters
) {
  const supabase = await createClient();
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("incidents")
    .select("*", { count: "exact" })
    .eq("organization_id", organizationId);

  // Apply filters
  if (filters?.severity) {
    query = query.eq("severity", filters.severity);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.service) {
    query = query.eq("service", filters.service);
  }

  // Apply sorting
  const sortBy = params?.sortBy || "created_at";
  const sortOrder = params?.sortOrder || "desc";
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  // Apply pagination
  query = query.range(offset, offset + pageSize - 1);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch incidents: ${error.message}`);
  }

  return {
    data: data || [],
    pagination: {
      page,
      pageSize,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize),
    },
  };
}

export async function getIncidentById(
  incidentId: string
): Promise<IncidentWithRelations | null> {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:84',message:'getIncidentById ENTRY',data:{incidentId,incidentIdType:typeof incidentId,incidentIdLength:incidentId?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  // Use service client to bypass RLS - we're already authenticated via withAuth
  const { createServiceClient } = await import("@/lib/supabase/server");
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:88',message:'Creating service client',data:{hasSupabaseUrl:!!process.env.NEXT_PUBLIC_SUPABASE_URL,hasServiceKey:!!process.env.SUPABASE_SERVICE_ROLE_KEY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  
  const supabase = createServiceClient();
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:92',message:'BEFORE database query',data:{incidentId,queryType:'select',table:'incidents'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  // Fetch incident
  const { data: incident, error: incidentError } = await supabase
    .from("incidents")
    .select("*")
    .eq("id", incidentId)
    .single();

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:100',message:'AFTER database query',data:{foundIncident:!!incident,hasError:!!incidentError,errorCode:incidentError?.code,errorMessage:incidentError?.message,errorDetails:incidentError?.details,errorHint:incidentError?.hint,incidentId:incident?.id,incidentOrgId:incident?.organization_id,incidentTitle:incident?.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  if (incidentError) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:106',message:'Database error occurred',data:{incidentId,errorCode:incidentError.code,errorMessage:incidentError.message,isPGRST116:incidentError.code === 'PGRST116'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    // PGRST116 means no rows returned (incident not found)
    // This is expected when incident doesn't exist
    if (incidentError.code === 'PGRST116') {
      console.log(`[getIncidentById] Incident ${incidentId} not found (PGRST116)`);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:110',message:'RETURNING null - PGRST116',data:{incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    } else {
      console.error(`[getIncidentById] Error fetching incident ${incidentId}:`, {
        code: incidentError.code,
        message: incidentError.message,
        details: incidentError.details,
        hint: incidentError.hint,
      });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:118',message:'RETURNING null - database error',data:{incidentId,errorCode:incidentError.code},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
    }
    return null;
  }

  if (!incident) {
    console.log(`[getIncidentById] Incident ${incidentId} not found in database (null result)`);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:123',message:'RETURNING null - no incident data',data:{incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return null;
  }

  console.log(`[getIncidentById] Successfully fetched incident ${incidentId}:`, {
    title: incident.title,
    organization_id: incident.organization_id,
    status: incident.status,
  });

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:130',message:'Incident found - fetching relations',data:{incidentId,incidentOrgId:incident.organization_id,incidentTitle:incident.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  // Fetch timeline events
  const { data: timelineEvents } = await supabase
    .from("timeline_events")
    .select("*")
    .eq("incident_id", incidentId)
    .order("timestamp", { ascending: true });

  // Fetch hypotheses
  console.log(`[getIncidentById] Fetching hypotheses for incident ${incidentId}...`);
  const { data: hypotheses, error: hypothesesError } = await supabase
    .from("hypotheses")
    .select("*")
    .eq("incident_id", incidentId)
    .order("confidence", { ascending: false });
  
  if (hypothesesError) {
    console.error(`[getIncidentById] Error fetching hypotheses:`, hypothesesError);
  } else {
    console.log(`[getIncidentById] Found ${hypotheses?.length || 0} hypotheses for incident ${incidentId}`);
  }

  const result = {
    ...incident,
    timeline_events: timelineEvents || [],
    hypotheses: hypotheses || [],
  };
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:150',message:'RETURNING incident with relations',data:{incidentId:result.id,incidentOrgId:result.organization_id,hasTimelineEvents:result.timeline_events.length > 0,hasHypotheses:result.hypotheses.length > 0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  return result;
}

export async function createIncident(
  organizationId: string,
  incidentData: {
    title: string;
    service: string;
    severity: IncidentSeverity;
    status?: IncidentStatus;
    description?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<Incident> {
  // Use service client to bypass RLS - we're already authenticated via withAuth
  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = createServiceClient();

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:132',message:'Creating incident in database',data:{organizationId,title:incidentData.title,hasSupabaseUrl:!!process.env.NEXT_PUBLIC_SUPABASE_URL,hasAnonKey:!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'K'})}).catch(()=>{});
  // #endregion

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:173',message:'BEFORE insert',data:{organizationId,title:incidentData.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  const { data, error } = await supabase
    .from("incidents")
    .insert({
      organization_id: organizationId,
      title: incidentData.title,
      service: incidentData.service,
      severity: incidentData.severity,
      status: incidentData.status || "active",
      description: incidentData.description || null,
      metadata: incidentData.metadata || {},
    })
    .select()
    .single();

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:186',message:'AFTER insert',data:{hasData:!!data,hasError:!!error,errorCode:error?.code,errorMessage:error?.message,createdIncidentId:data?.id,createdOrgId:data?.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  if (error || !data) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:192',message:'Insert failed - throwing error',data:{errorCode:error?.code,errorMessage:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    throw new Error(`Failed to create incident: ${error?.message}`);
  }

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db/queries/incidents.ts:197',message:'RETURNING created incident',data:{incidentId:data.id,incidentOrgId:data.organization_id,incidentTitle:data.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  return data;
}

export async function updateIncident(
  incidentId: string,
  updates: Partial<{
    title: string;
    service: string;
    severity: IncidentSeverity;
    status: IncidentStatus;
    mttr: string;
    description: string;
    assigned_to: string | null;
    resolved_at: string | null;
    metadata: Record<string, unknown>;
  }>
): Promise<Incident> {
  // Use service client to bypass RLS - we're already authenticated via withAuth
  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("incidents")
    .update(updates)
    .eq("id", incidentId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to update incident: ${error?.message}`);
  }

  return data;
}

export async function deleteIncident(incidentId: string): Promise<void> {
  // Use service client to bypass RLS - we're already authenticated via withAuth
  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("incidents")
    .delete()
    .eq("id", incidentId);

  if (error) {
    throw new Error(`Failed to delete incident: ${error.message}`);
  }
}

export async function createTimelineEvent(
  incidentId: string,
  eventData: {
    type: TimelineEventType;
    title: string;
    description?: string;
    timestamp?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<TimelineEvent> {
  // Use service client to bypass RLS - we're already authenticated via withAuth
  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("timeline_events")
    .insert({
      incident_id: incidentId,
      type: eventData.type,
      title: eventData.title,
      description: eventData.description || null,
      timestamp: eventData.timestamp || new Date().toISOString(),
      metadata: eventData.metadata || {},
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to create timeline event: ${error?.message}`);
  }

  return data;
}

export async function createHypothesis(
  incidentId: string,
  hypothesisData: {
    title: string;
    confidence: number;
    evidence: string[];
    suggested_fix: string;
  }
): Promise<Hypothesis> {
  console.log(`[createHypothesis] Creating hypothesis for incident ${incidentId}:`, {
    title: hypothesisData.title,
    confidence: hypothesisData.confidence,
    evidenceCount: hypothesisData.evidence.length,
  });
  
  // Use service client to bypass RLS - we're already authenticated via withAuth
  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("hypotheses")
    .insert({
      incident_id: incidentId,
      title: hypothesisData.title,
      confidence: hypothesisData.confidence,
      evidence: hypothesisData.evidence,
      suggested_fix: hypothesisData.suggested_fix,
    })
    .select()
    .single();

  if (error || !data) {
    console.error(`[createHypothesis] Failed to create hypothesis:`, {
      error: error?.message,
      code: error?.code,
      details: error?.details,
    });
    throw new Error(`Failed to create hypothesis: ${error?.message}`);
  }

  console.log(`[createHypothesis] Successfully created hypothesis:`, {
    id: data.id,
    title: data.title,
    confidence: data.confidence,
  });

  return data;
}

