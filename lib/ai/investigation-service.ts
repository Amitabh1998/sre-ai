/**
 * AI Investigation Service - Orchestrates the investigation process
 */

import { IncidentService } from "@/lib/api/incidents/service";
import { gatherInvestigationData } from "./data-gatherer";
import { generateHypotheses } from "./hypothesis-generator";
import { createClient } from "@/lib/supabase/server";
import type { Incident } from "@/lib/db/types";

export interface InvestigationResult {
  incidentId: string;
  hypotheses: Array<{
    id: string;
    title: string;
    confidence: number;
    evidence: string[];
    suggestedFix: string;
  }>;
  status: Incident["status"];
}

/**
 * Investigate an incident using AI
 */
export async function investigateIncident(
  incidentId: string
): Promise<InvestigationResult> {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:26',message:'investigateIncident ENTRY',data:{incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  
  console.log(`[investigateIncident] Starting investigation for incident ${incidentId}`);

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:34',message:'BEFORE IncidentService.getById',data:{incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  // Fetch incident
  const incident = await IncidentService.getById(incidentId);
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:38',message:'AFTER IncidentService.getById',data:{incidentId,foundIncident:!!incident,incidentTitle:incident?.title,incidentOrgId:incident?.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  if (!incident) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:41',message:'THROWING error - incident not found',data:{incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    console.error(`[investigateIncident] Incident ${incidentId} not found`);
    throw new Error(`Incident ${incidentId} not found`);
  }
  
  console.log(`[investigateIncident] Found incident: ${incident.title}, org: ${incident.organization_id}`);

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:57',message:'BEFORE status update',data:{incidentId,currentStatus:incident.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  // Update status to ai-investigating
  await IncidentService.update(incidentId, {
    status: "ai-investigating",
  });
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:63',message:'AFTER status update',data:{incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:66',message:'BEFORE addTimelineEvent',data:{incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  // Create timeline event
  await IncidentService.addTimelineEvent(incidentId, {
    type: "investigation",
    title: "AI Agent started investigation",
    description: "Analyzing logs, metrics, and recent changes",
  });
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:73',message:'AFTER addTimelineEvent',data:{incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:76',message:'BEFORE createAIActivity',data:{incidentId,organizationId:incident.organization_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  // Create AI activity
  await createAIActivity(incident.organization_id, {
    incidentId,
    type: "investigating",
    title: `Investigating ${incident.title}`,
    description: `Analyzing ${incident.service} logs for anomalies`,
    details: ["scanning_logs: in progress"],
    isLive: true,
  });
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:85',message:'AFTER createAIActivity',data:{incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:64',message:'BEFORE gatherInvestigationData',data:{incidentId,organizationId:incident.organization_id,service:incident.service},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    console.log(`[investigateIncident] Gathering investigation data...`);
    // Gather investigation data
    const investigationData = await gatherInvestigationData(
      incident.organization_id,
      incident.service,
      {
        start: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        end: new Date(),
      },
      incident.title
    );
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:76',message:'AFTER gatherInvestigationData',data:{incidentId,logsCount:investigationData.logs.length,metricsKeys:Object.keys(investigationData.metrics || {}),recentDeploymentsCount:investigationData.recentDeployments?.length || 0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    console.log(`[investigateIncident] Gathered data: ${investigationData.logs.length} logs, ${Object.keys(investigationData.metrics).length} metrics`);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:80',message:'BEFORE generateHypotheses',data:{incidentId,incidentTitle:incident.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    
    console.log(`[investigateIncident] Generating hypotheses...`);
    // Generate hypotheses
    const hypotheses = await generateHypotheses({
      title: incident.title,
      service: incident.service,
      severity: incident.severity,
      description: incident.description || undefined,
      logs: investigationData.logs,
      metrics: investigationData.metrics,
      recentDeployments: investigationData.recentDeployments,
    });
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:92',message:'AFTER generateHypotheses',data:{incidentId,hypothesesCount:hypotheses.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    
    console.log(`[investigateIncident] Generated ${hypotheses.length} hypotheses`);

    // Store hypotheses in database
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:95',message:'BEFORE storing hypotheses',data:{incidentId,hypothesesToStore:hypotheses.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
    // #endregion
    
    console.log(`[investigateIncident] Storing ${hypotheses.length} hypotheses in database...`);
    const storedHypotheses = [];
    for (const hypothesis of hypotheses) {
      try {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:100',message:'BEFORE addHypothesis',data:{incidentId,hypothesisTitle:hypothesis.title,hypothesisConfidence:hypothesis.confidence},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
        
        const stored = await IncidentService.addHypothesis(incidentId, {
          title: hypothesis.title,
          confidence: hypothesis.confidence,
          evidence: hypothesis.evidence,
          suggested_fix: hypothesis.suggestedFix,
        });
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:108',message:'AFTER addHypothesis',data:{incidentId,storedHypothesisId:stored.id,storedTitle:stored.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
        
        storedHypotheses.push(stored);
        console.log(`[investigateIncident] Stored hypothesis: ${hypothesis.title} (${hypothesis.confidence}%)`);
      } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:113',message:'Error storing hypothesis',data:{incidentId,hypothesisTitle:hypothesis.title,errorName:error instanceof Error ? error.name : 'unknown',errorMessage:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
        console.error(`[investigateIncident] Failed to store hypothesis:`, error);
        throw error;
      }
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:119',message:'AFTER storing all hypotheses',data:{incidentId,storedCount:storedHypotheses.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
    // #endregion
    
    console.log(`[investigateIncident] Successfully stored ${storedHypotheses.length} hypotheses`);

    // Update AI activity
    await createAIActivity(incident.organization_id, {
      incidentId,
      type: "investigating",
      title: `Investigation complete: ${incident.title}`,
      description: `Generated ${hypotheses.length} hypotheses`,
      details: [
        `hypotheses_generated: ${hypotheses.length}`,
        `highest_confidence: ${Math.max(...hypotheses.map((h) => h.confidence))}%`,
      ],
      isLive: false,
    });

    // Determine next status based on hypotheses
    const highestConfidence = Math.max(...hypotheses.map((h) => h.confidence));
    const nextStatus: Incident["status"] =
      highestConfidence >= 80 ? "human-intervention" : "human-intervention";

    await IncidentService.update(incidentId, {
      status: nextStatus,
    });

    return {
      incidentId,
      hypotheses: storedHypotheses,
      status: nextStatus,
    };
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:138',message:'Investigation error caught',data:{incidentId,errorName:error instanceof Error ? error.name : 'unknown',errorMessage:error instanceof Error ? error.message : String(error),errorStack:error instanceof Error ? error.stack : undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    console.error(`[investigateIncident] Investigation error for incident ${incidentId}:`, error);
    console.error(`[investigateIncident] Error details:`, {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    // Update status to human-intervention on error
    await IncidentService.update(incidentId, {
      status: "human-intervention",
    });
    throw error;
  }
}

/**
 * Create AI activity record
 */
async function createAIActivity(
  organizationId: string,
  activity: {
    incidentId?: string;
    type: "investigating" | "resolved" | "healed" | "health-check";
    title: string;
    description: string;
    details?: string[];
    isLive?: boolean;
  }
): Promise<void> {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:239',message:'createAIActivity ENTRY',data:{organizationId,activityType:activity.type,activityTitle:activity.title,hasIncidentId:!!activity.incidentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  
  // Use service client to bypass RLS - we're already authenticated via withAuth
  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = createServiceClient();

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:252',message:'BEFORE ai_activities insert',data:{organizationId,activityType:activity.type},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  const { error } = await supabase.from("ai_activities").insert({
    organization_id: organizationId,
    incident_id: activity.incidentId || null,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    details: activity.details || [],
    is_live: activity.isLive || false,
  });
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:263',message:'AFTER ai_activities insert',data:{organizationId,hasError:!!error,errorMessage:error?.message,errorCode:error?.code},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  
  if (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/investigation-service.ts:266',message:'createAIActivity error',data:{organizationId,errorMessage:error.message,errorCode:error.code},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    console.error(`[createAIActivity] Failed to create AI activity:`, error);
    throw error;
  }
}

