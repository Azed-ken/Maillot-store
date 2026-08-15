import { createClient } from "@/lib/supabase/server";
import type { StoreSettings } from "@/lib/types";

const FALLBACK_SETTINGS: StoreSettings = {
  id: true,
  store_name: process.env.NEXT_PUBLIC_DEFAULT_STORE_NAME || "Maillot Store",
  slogan: "Le maillot de vos couleurs.",
  description: "",
  logo_url: null,
  whatsapp_number: process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP_NUMBER || "22900000000",
  facebook_url: null,
  instagram_url: null,
  tiktok_url: null,
  footer_text: "",
};

/**
 * Réglages de la boutique, lus depuis "store_settings" (table à ligne unique).
 * Ne jamais hardcoder le nom/logo/WhatsApp ailleurs dans l'app : passer par ici.
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  return data ? (data as StoreSettings) : FALLBACK_SETTINGS;
}
