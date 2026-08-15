import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AdminProductRow from "@/components/AdminProductRow";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Produits</h1>
        <Link href="/admin/produits/nouveau" className="btn-primary !px-4 !py-2 text-sm">
          <Plus size={16} /> Ajouter
        </Link>
      </div>

      <div className="card-surface mt-6 overflow-x-auto p-5">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs font-medium text-ink-700/60">
              <th className="pb-2 pr-3">Produit</th>
              <th className="pb-2 pr-3">Prix</th>
              <th className="pb-2 pr-3">Stock</th>
              <th className="pb-2 pr-3"></th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((p) => (
              <AdminProductRow key={p.id} product={p as Product} />
            ))}
          </tbody>
        </table>
        {!products?.length && (
          <p className="py-10 text-center text-sm text-ink-700/50">Aucun produit pour le moment.</p>
        )}
      </div>
    </div>
  );
}
