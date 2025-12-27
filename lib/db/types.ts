/**
 * Database types - Generated from Supabase schema
 * These types should match the database schema exactly
 */

export type UserRole = "admin" | "member" | "viewer";
export type IncidentSeverity = "P1" | "P2" | "P3" | "P4";
export type IncidentStatus =
  | "active"
  | "ai-investigating"
  | "human-intervention"
  | "resolved"
  | "auto-healed"
  | "investigating";
export type TimelineEventType = "alert" | "investigation" | "action" | "resolution";
export type AIActivityType = "investigating" | "resolved" | "healed" | "health-check";
export type IntegrationCategory =
  | "alerting"
  | "observability"
  | "communication"
  | "source-control";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  organization_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Incident {
  id: string;
  organization_id: string;
  title: string;
  service: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  mttr: string | null;
  description: string | null;
  assigned_to: string | null;
  created_at: string;
  resolved_at: string | null;
  metadata: Record<string, unknown>;
}

export interface TimelineEvent {
  id: string;
  incident_id: string;
  type: TimelineEventType;
  title: string;
  description: string | null;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface Hypothesis {
  id: string;
  incident_id: string;
  title: string;
  confidence: number;
  evidence: string[];
  suggested_fix: string;
  created_at: string;
}

export interface Integration {
  id: string;
  organization_id: string;
  type: string;
  name: string;
  category: IntegrationCategory;
  connected: boolean;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AIActivity {
  id: string;
  organization_id: string;
  incident_id: string | null;
  type: AIActivityType;
  title: string;
  description: string;
  details: string[];
  is_live: boolean;
  timestamp: string;
}

