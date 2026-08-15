import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/ProductForm";
import type { Category } from "@/lib/types";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Nouveau produit</h1>
      <div className="mt-6">
        <ProductForm categories={(categories || []) as Category[]} />
      </div>
    </div>
  );
}
