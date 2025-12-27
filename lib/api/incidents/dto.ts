/**
 * Data Transfer Objects for incidents API
 */

import { z } from "zod";
import type { IncidentSeverity, IncidentStatus } from "@/lib/db/types";

export const createIncidentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  service: z.string().min(1, "Service is required"),
  severity: z.enum(["P1", "P2", "P3", "P4"]),
  status: z
    .enum([
      "active",
      "ai-investigating",
      "human-intervention",
      "resolved",
      "auto-healed",
      "investigating",
    ])
    .optional(),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const updateIncidentSchema = z.object({
  title: z.string().min(1).optional(),
  service: z.string().min(1).optional(),
  severity: z.enum(["P1", "P2", "P3", "P4"]).optional(),
  status: z
    .enum([
      "active",
      "ai-investigating",
      "human-intervention",
      "resolved",
      "auto-healed",
      "investigating",
    ])
    .optional(),
  mttr: z.string().optional(),
  description: z.string().optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  resolved_at: z.string().datetime().nullable().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type CreateIncidentDto = z.infer<typeof createIncidentSchema>;
export type UpdateIncidentDto = z.infer<typeof updateIncidentSchema>;

