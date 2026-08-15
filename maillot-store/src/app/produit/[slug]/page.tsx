import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductGallery from "@/components/ProductGallery";
import AddToCartPanel from "@/components/AddToCartPanel";
import { KIND_LABELS, type Product } from "@/lib/types";

export const revalidate = 30;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) notFound();

  const p = product as Product;

  return (
    <div className="container-app py-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery photos={p.photos} alt={p.name} />

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-700/60">
            {p.category?.name} · {KIND_LABELS[p.kind]}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{p.name}</h1>

          {p.description && (
            <p className="mt-4 text-sm leading-relaxed text-ink-700">{p.description}</p>
          )}

          <div className="mt-6">
            <AddToCartPanel product={p} />
          </div>
        </div>
      </div>
    </div>
  );
}
