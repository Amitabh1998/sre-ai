/**
 * Data Transfer Objects for integrations API
 */

import { z } from "zod";
import type { IntegrationCategory } from "@/lib/db/types";

export const connectIntegrationSchema = z.object({
  type: z.string().min(1, "Integration type is required"),
  name: z.string().min(1, "Integration name is required"),
  category: z.enum(["alerting", "observability", "communication", "source-control"]),
  config: z.record(z.unknown()),
});

export type ConnectIntegrationDto = z.infer<typeof connectIntegrationSchema>;

