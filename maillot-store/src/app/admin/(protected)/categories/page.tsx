import { createClient } from "@/lib/supabase/server";
import CategoriesManager from "@/components/CategoriesManager";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return <CategoriesManager categories={(categories || []) as Category[]} />;
}
