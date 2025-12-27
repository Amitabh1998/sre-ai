/**
 * Database queries for users
 */

import { createClient } from "@/lib/supabase/server";
import type { User } from "@/lib/db/types";

export async function getUserById(userId: string): Promise<User | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getUsersByOrganization(
  organizationId: string
): Promise<User[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return data || [];
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  return getUserById(authUser.id);
}

export async function getCurrentUserOrganizationId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.organization_id || null;
}

