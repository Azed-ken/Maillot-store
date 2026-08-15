"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShoppingCart, Shirt } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/ToastProvider";
import { formatPrice } from "@/lib/format";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { createOrder } from "@/lib/actions/orders";

export default function CartClient({ whatsappNumber }: { whatsappNumber: string }) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const showToast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleQuantity = (productId: string, size: string | null, quantity: number) => {
    const result = updateQuantity(productId, size, quantity);
    showToast(result.message, result.ok ? "success" : "error");
  };
  
  const handleRemove = (productId: string, size: string | null) => {
    removeItem(productId, size);
    showToast("Produit supprimé");
  };
  
  const handleCheckout = async () => {
    if (!items.length) return;
    setIsSubmitting(true);
    
    const result = await createOrder(
      items.map((i) => ({
        productId: i.productId,
        name: i.name,
        slug: i.slug,
        price: i.price,
        photo: i.photo,
        size: i.size,
        quantity: i.quantity,
        stock: i.stock,
      }))
    );
    
    const message = buildOrderMessage(items);
    const url = buildWhatsAppUrl(whatsappNumber, message);
    
    if (!result.ok) {
      showToast("La commande n'a pas pu être enregistrée, mais tu peux continuer.", "error");
    }
    
    window.open(url, "_blank");
    clear();
    setIsSubmitting(false);
  };
  
  if (!items.length) {
    return (
      <div className="container-app flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-950/[0.04] text-ink-950/30">
          <ShoppingCart size={32} strokeWidth={1.5} />
        </p>
        <h1 className="font-display text-xl font-bold">Ton panier est vide</h1>
        <p className="text-sm text-ink-700/70">Découvre notre catalogue de maillots authentiques.</p>
        <Link href="/catalogue" className="btn-primary mt-2">
          Voir le catalogue <ArrowRight size={16} />
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container-app py-8">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Mon panier</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size ?? "nosize"}`}
              className="card-surface flex gap-4 p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-800/5">
                {item.photo ? (
                  <Image src={item.photo} alt={item.name} fill sizes="80px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-ink-950/20">
                    <Shirt size={24} />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-ink-950">{item.name}</p>
                    {item.size && <p className="text-xs text-ink-700/60">Taille {item.size}</p>}
                  </div>
                  <button
                    onClick={() => handleRemove(item.productId, item.size)}
                    className="text-ink-700/40 transition-colors hover:text-red-500"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1 rounded-lg border border-ink-950/15 p-0.5">
                    <button
                      onClick={() => handleQuantity(item.productId, item.size, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-ink-950/5"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantity(item.productId, item.size, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-ink-950/5"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-surface h-fit space-y-4 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-700">Sous-total</span>
            <span className="font-semibold">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-ink-950/5 pt-4 text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="btn-accent w-full disabled:opacity-50"
          >
            <ShoppingBag size={18} />
            {isSubmitting ? "Préparation..." : "Commander sur WhatsApp"}
          </button>

          <Link href="/catalogue" className="block text-center text-xs font-medium text-ink-700 hover:text-ink-950">
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}