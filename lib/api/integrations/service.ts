/**
 * Business logic for integrations
 */

import {
  getIntegrations,
  getIntegrationById,
  createIntegration,
  updateIntegration,
  deleteIntegration,
} from "@/lib/db/queries/integrations";
import type { ConnectIntegrationDto } from "./dto";
import type { Integration } from "@/lib/db/types";
import { encryptConfig, decryptConfig } from "./encryption";

export class IntegrationService {
  /**
   * Get all integrations for an organization
   */
  static async getAll(organizationId: string): Promise<Integration[]> {
    const integrations = await getIntegrations(organizationId);
    // Decrypt configs before returning
    return integrations.map((integration) => ({
      ...integration,
      config: decryptConfig(integration.config),
    }));
  }

  /**
   * Get integration by ID
   */
  static async getById(integrationId: string): Promise<Integration | null> {
    const integration = await getIntegrationById(integrationId);
    if (!integration) return null;
    return {
      ...integration,
      config: decryptConfig(integration.config),
    };
  }

  /**
   * Create a new integration
   */
  static async create(
    organizationId: string,
    data: ConnectIntegrationDto
  ): Promise<Integration> {
    // Encrypt sensitive config data
    const encryptedConfig = encryptConfig(data.config);

    const integration = await createIntegration(organizationId, {
      type: data.type,
      name: data.name,
      category: data.category,
      config: encryptedConfig,
      connected: true,
    });

    return {
      ...integration,
      config: decryptConfig(integration.config),
    };
  }

  /**
   * Update an integration
   */
  static async update(
    integrationId: string,
    updates: {
      connected?: boolean;
      config?: Record<string, unknown>;
    }
  ): Promise<Integration> {
    const updateData: Parameters<typeof updateIntegration>[1] = {};

    if (updates.connected !== undefined) {
      updateData.connected = updates.connected;
    }

    if (updates.config !== undefined) {
      updateData.config = encryptConfig(updates.config);
    }

    const integration = await updateIntegration(integrationId, updateData);

    return {
      ...integration,
      config: decryptConfig(integration.config),
    };
  }

  /**
   * Delete an integration
   */
  static async delete(integrationId: string): Promise<void> {
    return deleteIntegration(integrationId);
  }
}

