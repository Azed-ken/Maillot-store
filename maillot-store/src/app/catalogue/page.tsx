import { createClient } from "@/lib/supabase/server";
import CatalogueFilters from "@/components/CatalogueFilters";
import ProductGrid from "@/components/ProductGrid";
import type { Category, Product } from "@/lib/types";

export const revalidate = 30;

interface PageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    kind?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function CataloguePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  const categories = (categoriesData || []) as Category[];

  let query = supabase.from("products").select("*, category:categories(*)").eq("is_active", true);

  if (params.q) {
    query = query.ilike("name", `%${params.q}%`);
  }
  if (params.kind) {
    query = query.eq("kind", params.kind);
  }
  if (params.category) {
    const cat = categories.find((c) => c.slug === params.category);
    if (cat) query = query.eq("category_id", cat.id);
  } else if (params.type) {
    const idsOfType = categories.filter((c) => c.type === params.type).map((c) => c.id);
    if (idsOfType.length) query = query.in("category_id", idsOfType);
  }

  if (params.sort === "price_asc") query = query.order("price", { ascending: true });
  else if (params.sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data: products } = await query;

  return (
    <div className="container-app py-8">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Catalogue</h1>
      <p className="mt-1 text-sm text-ink-700/70">
        {products?.length || 0} maillot{(products?.length || 0) > 1 ? "s" : ""} disponible{(products?.length || 0) > 1 ? "s" : ""}
      </p>

      <div className="mt-6">
        <CatalogueFilters categories={categories} searchParams={params} />
      </div>

      <div className="mt-8">
        <ProductGrid products={(products || []) as Product[]} />
      </div>
    </div>
  );
}
