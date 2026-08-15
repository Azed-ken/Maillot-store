"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => { ok: boolean; message: string };
  updateQuantity: (
    productId: string,
    size: string | null,
    quantity: number
  ) => { ok: boolean; message: string };
  removeItem: (productId: string, size: string | null) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

function sameLine(a: CartItem, productId: string, size: string | null) {
  return a.productId === productId && (a.size ?? null) === (size ?? null);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => sameLine(i, item.productId, item.size));

        if (existing) {
          const newQty = existing.quantity + item.quantity;
          if (newQty > item.stock) {
            return { ok: false, message: "Stock insuffisant" };
          }
          set({
            items: items.map((i) =>
              sameLine(i, item.productId, item.size)
                ? { ...i, quantity: newQty }
                : i
            ),
          });
          return { ok: true, message: "Quantité mise à jour" };
        }

        if (item.quantity > item.stock) {
          return { ok: false, message: "Stock insuffisant" };
        }

        set({ items: [...items, item] });
        return { ok: true, message: "Produit ajouté au panier" };
      },

      updateQuantity: (productId, size, quantity) => {
        const items = get().items;
        const line = items.find((i) => sameLine(i, productId, size));
        if (!line) return { ok: false, message: "Produit introuvable" };

        if (quantity <= 0) {
          set({ items: items.filter((i) => !sameLine(i, productId, size)) });
          return { ok: true, message: "Produit supprimé" };
        }

        if (quantity > line.stock) {
          return { ok: false, message: "Stock insuffisant" };
        }

        set({
          items: items.map((i) =>
            sameLine(i, productId, size) ? { ...i, quantity } : i
          ),
        });
        return { ok: true, message: "Quantité mise à jour" };
      },

      removeItem: (productId, size) => {
        set({
          items: get().items.filter((i) => !sameLine(i, productId, size)),
        });
      },

      clear: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    }),
    {
      name: "maillot-store-cart",
    }
  )
);
