"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";
import { revalidatePath } from "next/cache";
import type { ProductKind } from "@/lib/types";

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string | null;
  kind: ProductKind;
  sizes: string[];
  photos: string[];
  is_new: boolean;
  is_popular: boolean;
  is_active: boolean;
}

export async function createProduct(input: ProductInput) {
  const supabase = await createClient();
  const slug = `${slugify(input.name)}-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from("products")
    .insert({ ...input, slug })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/produits");
  revalidatePath("/catalogue");
  return { ok: true, id: data.id as string };
}

export async function updateProduct(id: string, input: ProductInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update(input).eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/produits");
  revalidatePath("/catalogue");
  return { ok: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/produits");
  revalidatePath("/catalogue");
  return { ok: true };
}

export async function uploadProductPhoto(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File | null;
  if (!file) return { ok: false, error: "Aucun fichier fourni." };

  const path = `products/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const { error } = await supabase.storage.from("product-photos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from("product-photos").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
