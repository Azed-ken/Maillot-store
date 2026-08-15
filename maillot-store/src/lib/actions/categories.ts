"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";
import { revalidatePath } from "next/cache";
import type { CategoryType } from "@/lib/types";

export interface CategoryInput {
  name: string;
  type: CategoryType;
  country_flag: string | null;
  sort_order: number;
}

export async function createCategory(input: CategoryInput) {
  const supabase = await createClient();
  const slug = `${slugify(input.name)}`;

  const { error } = await supabase.from("categories").insert({ ...input, slug });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
  return { ok: true };
}

export async function updateCategory(id: string, input: CategoryInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").update(input).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
  return { ok: true };
}
