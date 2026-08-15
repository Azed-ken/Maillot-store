import { createClient } from "@/lib/supabase/server";
import AdminOrderRow from "@/components/AdminOrderRow";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Commandes</h1>

      <div className="mt-6 space-y-3">
        {(orders || []).map((o) => (
          <AdminOrderRow key={o.id} order={o as Order} />
        ))}
        {!orders?.length && (
          <p className="py-10 text-center text-sm text-ink-700/50">Aucune commande pour le moment.</p>
        )}
      </div>
    </div>
  );
}
