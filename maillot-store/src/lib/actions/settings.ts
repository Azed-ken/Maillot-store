"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { StoreSettings } from "@/lib/types";

export async function updateStoreSettings(
  input: Omit<StoreSettings, "id">
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("store_settings")
    .update(input)
    .eq("id", true);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/parametres");
  return { ok: true };
}
