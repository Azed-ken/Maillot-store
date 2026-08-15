import { createClient } from "@/lib/supabase/server";

/**
 * Retourne l'utilisateur connecté s'il est bien listé dans la table "admins",
 * sinon null. À utiliser dans les layouts/pages admin pour bloquer l'accès
 * à un compte authentifié mais non autorisé.
 */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) return null;

  return user;
}
