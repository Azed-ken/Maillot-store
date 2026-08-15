"use server";

import { createClient } from "@/lib/supabase/server";
import type { CartItem, OrderStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

interface CreateOrderResult {
  ok: boolean;
  orderId?: string;
  error?: string;
}

/**
 * Enregistre la commande (orders + order_items) dans Supabase.
 * Appelée juste avant l'ouverture de WhatsApp, avec le panier réel.
 * Les prix sont figés au moment de la commande (product_price).
 */
export async function createOrder(items: CartItem[]): Promise<CreateOrderResult> {
  if (!items.length) {
    return { ok: false, error: "Le panier est vide." };
  }

  const supabase = await createClient();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ total, status: "nouvelle" })
    .select("id")
    .single();

  if (orderError || !order) {
    return { ok: false, error: "Impossible d'enregistrer la commande." };
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    product_price: item.price,
    size: item.size,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    return { ok: false, error: "Impossible d'enregistrer les articles de la commande." };
  }

  return { ok: true, orderId: order.id as string };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/commandes");
  return { ok: true };
}
