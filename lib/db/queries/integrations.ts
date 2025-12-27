/**
 * Database queries for integrations
 */

import { createClient } from "@/lib/supabase/server";
import type { Integration, IntegrationCategory } from "@/lib/db/types";

export async function getIntegrations(
  organizationId: string
): Promise<Integration[]> {
  // Use service client to bypass RLS - we're already authenticated via withAuth
  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch integrations: ${error.message}`);
  }

  return data || [];
}

export async function getIntegrationById(
  integrationId: string
): Promise<Integration | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("id", integrationId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function createIntegration(
  organizationId: string,
  integrationData: {
    type: string;
    name: string;
    category: IntegrationCategory;
    config: Record<string, unknown>;
    connected?: boolean;
  }
): Promise<Integration> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("integrations")
    .insert({
      organization_id: organizationId,
      type: integrationData.type,
      name: integrationData.name,
      category: integrationData.category,
      config: integrationData.config,
      connected: integrationData.connected || false,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to create integration: ${error?.message}`);
  }

  return data;
}

export async function updateIntegration(
  integrationId: string,
  updates: Partial<{
    connected: boolean;
    config: Record<string, unknown>;
  }>
): Promise<Integration> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("integrations")
    .update(updates)
    .eq("id", integrationId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to update integration: ${error?.message}`);
  }

  return data;
}

export async function deleteIntegration(integrationId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("integrations")
    .delete()
    .eq("id", integrationId);

  if (error) {
    throw new Error(`Failed to delete integration: ${error.message}`);
  }
}

