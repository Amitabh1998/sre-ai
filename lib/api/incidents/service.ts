/**
 * Business logic for incidents
 */

import {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  createTimelineEvent,
  createHypothesis,
  type PaginationParams,
  type IncidentFilters,
} from "@/lib/db/queries/incidents";
import type { CreateIncidentDto, UpdateIncidentDto } from "./dto";
import type { Incident, TimelineEvent, Hypothesis } from "@/lib/db/types";

export class IncidentService {
  /**
   * Get paginated incidents for an organization
   */
  static async getAll(
    organizationId: string,
    params?: PaginationParams,
    filters?: IncidentFilters
  ) {
    return getIncidents(organizationId, params, filters);
  }

  /**
   * Get incident by ID with relations
   */
  static async getById(incidentId: string) {
    return getIncidentById(incidentId);
  }

  /**
   * Create a new incident
   */
  static async create(
    organizationId: string,
    data: CreateIncidentDto
  ): Promise<Incident> {
    const incident = await createIncident(organizationId, {
      title: data.title,
      service: data.service,
      severity: data.severity,
      status: data.status,
      description: data.description,
      metadata: data.metadata,
    });

    // Create initial timeline event
    await createTimelineEvent(incident.id, {
      type: "alert",
      title: "Incident created",
      description: `Incident ${incident.id} was created`,
    });

    return incident;
  }

  /**
   * Update an incident
   */
  static async update(
    incidentId: string,
    data: UpdateIncidentDto
  ): Promise<Incident> {
    const updates: Parameters<typeof updateIncident>[1] = {};

    if (data.title !== undefined) updates.title = data.title;
    if (data.service !== undefined) updates.service = data.service;
    if (data.severity !== undefined) updates.severity = data.severity;
    if (data.status !== undefined) updates.status = data.status;
    if (data.mttr !== undefined) updates.mttr = data.mttr;
    if (data.description !== undefined) updates.description = data.description;
    if (data.assigned_to !== undefined) updates.assigned_to = data.assigned_to;
    if (data.resolved_at !== undefined)
      updates.resolved_at = data.resolved_at;
    if (data.metadata !== undefined) updates.metadata = data.metadata;

    return updateIncident(incidentId, updates);
  }

  /**
   * Delete an incident
   */
  static async delete(incidentId: string): Promise<void> {
    return deleteIncident(incidentId);
  }

  /**
   * Add a timeline event to an incident
   */
  static async addTimelineEvent(
    incidentId: string,
    event: {
      type: TimelineEvent["type"];
      title: string;
      description?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<TimelineEvent> {
    return createTimelineEvent(incidentId, event);
  }

  /**
   * Add a hypothesis to an incident
   */
  static async addHypothesis(
    incidentId: string,
    hypothesis: {
      title: string;
      confidence: number;
      evidence: string[];
      suggested_fix: string;
    }
  ): Promise<Hypothesis> {
    return createHypothesis(incidentId, hypothesis);
  }
}

