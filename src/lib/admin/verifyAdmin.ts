import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminSession = { userId: string };

/** Returns admin user id if session is authenticated and profile role is admin. */
export async function requireAdmin(
  supabase: SupabaseClient,
): Promise<AdminSession | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || profile.role !== "admin") return null;
  return { userId: user.id };
}
