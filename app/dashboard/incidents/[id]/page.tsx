"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Timeline, type TimelineEvent } from "@/components/features/Timeline";
import { HypothesisCard, type Hypothesis } from "@/components/features/HypothesisCard";
import { formatDate } from "@/lib/utils/format";
import { incidentsApi } from "@/lib/api/incidents";
import { useAsync } from "@/lib/hooks/useAsync";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { Incident } from "@/lib/types";

// Helper function to convert database hypothesis to component type
function mapHypothesis(h: any): Hypothesis {
  return {
    id: h.id,
    title: h.title,
    confidence: h.confidence,
    evidence: Array.isArray(h.evidence) ? h.evidence : [],
    suggestedFix: h.suggested_fix || "",
  };
}

// Helper function to convert database timeline event to component type
function mapTimelineEvent(e: any): TimelineEvent {
  return {
    id: e.id,
    timestamp: e.timestamp,
    type: e.type,
    title: e.title,
    description: e.description || undefined,
  };
}

export default function IncidentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isTriggeringInvestigation, setIsTriggeringInvestigation] = useState(false);

  // Memoize the async function to prevent infinite re-renders
  const fetchIncident = useCallback(() => {
    return incidentsApi.getById(params.id);
  }, [params.id]);

  const { data: incidentData, loading, error, execute } = useAsync(fetchIncident);

  // Execute the API call on mount and when params.id changes
  useEffect(() => {
    execute();
  }, [execute]);

  // Poll for updates if investigation is in progress
  useEffect(() => {
    if (!incidentData) return;
    
    const hypotheses = (incidentData.hypotheses || []);
    const isInvestigating = incidentData.status === "ai-investigating";
    
    // Poll if investigation is in progress
    if (isInvestigating) {
      console.log('[IncidentDetailPage] Starting polling - status:', incidentData.status, 'hypotheses:', hypotheses.length);
      const interval = setInterval(() => {
        console.log('[IncidentDetailPage] Polling for investigation updates...');
        execute();
      }, 2000); // Poll every 2 seconds for faster updates

      // Stop polling after 60 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval);
        console.log('[IncidentDetailPage] Stopped polling after timeout');
      }, 60000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [incidentData?.status, execute]);

  // If investigation just completed but we don't have hypotheses yet, refresh once
  useEffect(() => {
    if (!incidentData) return;
    
    const hypotheses = (incidentData.hypotheses || []);
    const investigationCompleted = incidentData.status === "human-intervention" && hypotheses.length === 0;
    
    if (investigationCompleted) {
      console.log('[IncidentDetailPage] Investigation completed but no hypotheses found, refreshing...');
      // Refresh after a short delay to allow backend to finish
      const timeout = setTimeout(() => {
        execute();
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [incidentData?.status, incidentData?.hypotheses?.length, execute]);

  const handleTriggerInvestigation = async () => {
    // #region agent log
    if (typeof window !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/incidents/[id]/page.tsx:60',message:'handleTriggerInvestigation ENTRY',data:{incidentId:params.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }
    // #endregion
    
    setIsTriggeringInvestigation(true);
    try {
      // #region agent log
      if (typeof window !== 'undefined') {
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/incidents/[id]/page.tsx:64',message:'BEFORE fetch investigate API',data:{incidentId:params.id,endpoint:`/api/incidents/${params.id}/investigate`},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      }
      // #endregion
      
      // Get mock auth headers from localStorage (same logic as apiClient)
      let mockAuthHeaders: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        try {
          const authStorage = localStorage.getItem("auth-storage");
          if (authStorage) {
            const authData = JSON.parse(authStorage);
            const user = authData?.state?.user || authData?.user;
            const isAuthenticated = authData?.state?.isAuthenticated ?? authData?.isAuthenticated;
            
            if (user && isAuthenticated) {
              mockAuthHeaders = {
                "x-mock-user-id": user.id || "dev-user-id",
                "x-mock-user-email": user.email || "dev@example.com",
              };
            }
          }
        } catch (e) {
          console.error("Error reading auth from localStorage:", e);
        }
      }

      const response = await fetch(`/api/incidents/${params.id}/investigate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...mockAuthHeaders,
        },
      });

      // #region agent log
      if (typeof window !== 'undefined') {
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/incidents/[id]/page.tsx:70',message:'AFTER fetch investigate API',data:{incidentId:params.id,responseOk:response.ok,responseStatus:response.status,responseStatusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      }
      // #endregion

      if (!response.ok) {
        const error = await response.json();
        // #region agent log
        if (typeof window !== 'undefined') {
          fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/incidents/[id]/page.tsx:74',message:'Investigation API returned error',data:{incidentId:params.id,error,responseStatus:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        }
        // #endregion
        alert(error.error || "Failed to trigger investigation");
        return;
      }

      // #region agent log
      if (typeof window !== 'undefined') {
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/incidents/[id]/page.tsx:80',message:'Investigation triggered successfully, scheduling refresh',data:{incidentId:params.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
      }
      // #endregion

      // Refresh the incident data after a short delay
      setTimeout(() => {
        // #region agent log
        if (typeof window !== 'undefined') {
          fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/incidents/[id]/page.tsx:85',message:'Executing refresh after investigation',data:{incidentId:params.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
        }
        // #endregion
        execute();
      }, 2000);
    } catch (error) {
      // #region agent log
      if (typeof window !== 'undefined') {
        fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/incidents/[id]/page.tsx:89',message:'Error in handleTriggerInvestigation',data:{incidentId:params.id,errorName:error instanceof Error ? error.name : 'unknown',errorMessage:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      }
      // #endregion
      console.error("Error triggering investigation:", error);
      alert("Failed to trigger investigation");
    } finally {
      setIsTriggeringInvestigation(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/incidents/[id]/page.tsx:94',message:'Rendering check',data:{hasError:!!error,error,hasIncidentData:!!incidentData,paramsId:params.id,loading},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
  }
  // #endregion

  if (error) {
    console.error("Error loading incident:", error);
    // #region agent log
    if (typeof window !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/incidents/[id]/page.tsx:97',message:'RETURNING error component',data:{error,paramsId:params.id},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
    }
    // #endregion
    return <ErrorMessage error={error} />;
  }

  // FIX: useAsync returns the incident object directly in 'data', not wrapped in { data: incident }
  if (!incidentData) {
    console.error("No incident data returned:", { incidentData, paramsId: params.id });
    // #region agent log
    if (typeof window !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/incidents/[id]/page.tsx:101',message:'RETURNING not found component',data:{incidentData,paramsId:params.id,incidentDataType:typeof incidentData,hasIncidentData:!!incidentData},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
    }
    // #endregion
    return <ErrorMessage error={new Error(`Incident not found (ID: ${params.id})`)} />;
  }

  const incident = incidentData as any; // useAsync returns the incident object directly
  const timelineEvents = (incident.timeline_events || []).map(mapTimelineEvent);
  const hypotheses = (incident.hypotheses || []).map(mapHypothesis);
  
  // Debug logging
  console.log('[IncidentDetailPage] Rendering with:', {
    incidentId: incident.id,
    status: incident.status,
    hypothesesCount: hypotheses.length,
    hasHypotheses: hypotheses.length > 0,
  });
  const severityVariant =
    incident.severity === "P1"
      ? "severity-p1"
      : incident.severity === "P2"
      ? "severity-p2"
      : "severity-p3";

  const statusVariant =
    incident.status === "resolved"
      ? "success"
      : incident.status === "ai-investigating" || incident.status === "investigating"
      ? "severity-p2"
      : "severity-p1";

  const canTriggerInvestigation =
    incident.status !== "ai-investigating" &&
    incident.status !== "resolved" &&
    incident.status !== "auto-healed";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-700/50">
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant={severityVariant as any} className="text-xs font-semibold px-3 py-1">
              {incident.severity}
            </Badge>
            <h1 className="text-3xl font-bold text-white leading-tight">{incident.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">dns</span>
              <span className="font-medium">{incident.service}</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">schedule</span>
              <span>{formatDate(incident.created_at, "MMM d, yyyy 'at' HH:mm")}</span>
            </div>
            {incident.mttr && (
              <>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">timer</span>
                  <span className="font-medium text-slate-300">MTTR: {incident.mttr}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {canTriggerInvestigation && (
            <Button
              variant="secondary"
              onClick={handleTriggerInvestigation}
              loading={isTriggeringInvestigation}
              className="gap-2"
            >
              {!isTriggeringInvestigation && (
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
              )}
              Trigger Investigation
            </Button>
          )}
          <Badge variant={statusVariant as any} className="text-xs font-semibold px-3 py-1.5">
            {incident.status.charAt(0).toUpperCase() + incident.status.slice(1).replace(/-/g, " ")}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="postmortem">Post-Mortem</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-surface-dark to-slate-900/30">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary">description</span>
                  <CardTitle>Description</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed text-base">
                  {incident.description || (
                    <span className="text-slate-500 italic">No description provided.</span>
                  )}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-lg">dns</span>
                    <CardTitle className="text-xs text-slate-400 uppercase tracking-wide">
                      Service
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-white">{incident.service}</p>
                </CardContent>
              </Card>
              <Card className="hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-lg">
                      priority_high
                    </span>
                    <CardTitle className="text-xs text-slate-400 uppercase tracking-wide">
                      Severity
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant={severityVariant as any} className="text-sm font-semibold px-3 py-1">
                    {incident.severity}
                  </Badge>
                </CardContent>
              </Card>
              <Card className="hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-lg">timer</span>
                    <CardTitle className="text-xs text-slate-400 uppercase tracking-wide">
                      MTTR
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-white">
                    {incident.mttr || (
                      <span className="text-slate-500 text-base font-normal">—</span>
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

            <TabsContent value="timeline">
              <Card className="bg-gradient-to-br from-surface-dark to-slate-900/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">timeline</span>
                    <CardTitle>Incident Timeline</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    Track all events and actions related to this incident
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {timelineEvents.length > 0 ? (
                    <Timeline events={timelineEvents} />
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 mb-4">
                        <span className="material-symbols-outlined text-slate-500 text-2xl">
                          timeline
                        </span>
                      </div>
                      <p className="text-slate-400 font-medium">No timeline events yet</p>
                      <p className="text-slate-500 text-sm mt-1">
                        Events will appear here as the incident progresses
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

        <TabsContent value="analysis">
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-surface-dark to-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <span className="material-symbols-outlined text-primary text-xl">
                          psychology
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold text-white">
                        AI-Generated Hypotheses
                      </CardTitle>
                    </div>
                    <p className="text-sm text-slate-400 mt-2 ml-11">
                      {incident.status === "ai-investigating" ? (
                        <span className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                          AI agent is currently analyzing logs, metrics, and recent changes...
                        </span>
                      ) : hypotheses.length > 0 ? (
                        `Analyzed ${hypotheses.length} potential root cause${hypotheses.length > 1 ? "s" : ""} based on incident data`
                      ) : (
                        "No hypotheses generated yet. Trigger an investigation to get AI-powered root cause analysis."
                      )}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {hypotheses.length > 0 ? (
              <div className="space-y-4">
                {hypotheses.map((hypothesis, index) => (
                  <div key={hypothesis.id} className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-transparent"></div>
                    <HypothesisCard hypothesis={hypothesis} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-slate-700/50 bg-slate-900/20">
                <CardContent className="py-12 text-center">
                  {incident.status === "ai-investigating" ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <span className="material-symbols-outlined text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
                          psychology
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-medium text-slate-200 mb-1">
                          Investigation in progress...
                        </p>
                        <p className="text-sm text-slate-400">
                          The AI agent is analyzing your incident data
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700">
                        <span className="material-symbols-outlined text-slate-500 text-3xl">
                          auto_awesome
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-medium text-slate-300 mb-1">
                          No hypotheses available
                        </p>
                        <p className="text-sm text-slate-500">
                          Click 'Trigger Investigation' to start AI analysis
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="postmortem">
          <Card>
            <CardHeader>
              <CardTitle>Post-Mortem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Post-mortem documentation will be available after the incident review
                meeting.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

