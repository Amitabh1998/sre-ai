/**
 * Background job for processing incident investigations
 */

import { investigateIncident } from "@/lib/ai/investigation-service";

/**
 * Process investigation job
 * This would typically be called by a job queue (e.g., Vercel Cron, BullMQ, etc.)
 */
export async function processInvestigationJob(incidentId: string): Promise<void> {
  try {
    console.log(`Starting investigation for incident ${incidentId}`);
    const result = await investigateIncident(incidentId);
    console.log(`Investigation complete for incident ${incidentId}:`, result);
  } catch (error) {
    console.error(`Investigation failed for incident ${incidentId}:`, error);
    throw error;
  }
}

