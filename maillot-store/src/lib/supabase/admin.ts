import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client "service role" — bypass RLS.
 * À utiliser UNIQUEMENT dans du code serveur (route handlers, server actions)
 * pour des opérations d'administration ponctuelles (ex : ajouter un admin).
 * Ne jamais importer ce fichier depuis un composant "use client".
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquante — configure ta variable d'environnement serveur."
    );
  }

  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
