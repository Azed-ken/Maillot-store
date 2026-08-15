import { createClient } from "@/lib/supabase/server";
import StatCard from "@/components/StatCard";
import { formatPrice, formatDate } from "@/lib/format";
import { STATUS_LABELS, type Order, type OrderStatus } from "@/lib/types";
import clsx from "clsx";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<OrderStatus, string> = {
  nouvelle: "bg-blue-50 text-blue-600",
  confirmee: "bg-amber-50 text-amber-600",
  livree: "bg-green-50 text-green-600",
  annulee: "bg-red-50 text-red-600",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  const allOrders = (orders || []) as Order[];

  const total = allOrders.length;
  const nouvelles = allOrders.filter((o) => o.status === "nouvelle").length;
  const confirmees = allOrders.filter((o) => o.status === "confirmee").length;
  const livrees = allOrders.filter((o) => o.status === "livree").length;
  const revenue = allOrders
    .filter((o) => o.status !== "annulee")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const productCounts = new Map<string, { name: string; qty: number }>();
  allOrders.forEach((o) => {
    o.order_items?.forEach((item) => {
      const key = item.product_id || item.product_name;
      const existing = productCounts.get(key);
      if (existing) existing.qty += item.quantity;
      else productCounts.set(key, { name: item.product_name, qty: item.quantity });
    });
  });
  const topProducts = [...productCounts.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Tableau de bord</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Commandes" value={total} />
        <StatCard label="Nouvelles" value={nouvelles} />
        <StatCard label="Confirmées" value={confirmees} />
        <StatCard label="Livrées" value={livrees} />
        <StatCard label="Chiffre d'affaires" value={formatPrice(revenue)} accent />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold">Dernières commandes</h2>
          <div className="mt-3 space-y-2">
            {allOrders.slice(0, 6).map((o) => (
              <div key={o.id} className="flex items-center justify-between border-b border-ink-950/5 py-2 text-sm last:border-0">
                <div>
                  <p className="font-medium">#{o.id.slice(0, 8)}</p>
                  <p className="text-xs text-ink-700/60">{formatDate(o.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_STYLES[o.status])}>
                    {STATUS_LABELS[o.status]}
                  </span>
                  <span className="font-semibold">{formatPrice(o.total)}</span>
                </div>
              </div>
            ))}
            {!allOrders.length && (
              <p className="py-6 text-center text-sm text-ink-700/50">Aucune commande pour le moment.</p>
            )}
          </div>
        </div>

        <div className="card-surface p-5">
          <h2 className="text-sm font-semibold">Produits les plus commandés</h2>
          <div className="mt-3 space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.name + i} className="flex items-center justify-between text-sm">
                <span className="line-clamp-1">{p.name}</span>
                <span className="font-semibold text-ink-700">{p.qty}</span>
              </div>
            ))}
            {!topProducts.length && (
              <p className="py-6 text-center text-sm text-ink-700/50">Pas encore de données.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
