"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/ToastProvider";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function AddToCartPanel({ product }: { product: Product }) {
  const hasSizes = product.sizes.length > 0;
  const [size, setSize] = useState < string | null > (hasSizes ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToast();
  const outOfStock = product.stock <= 0;
  
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => Math.min(product.stock, q + 1));
  
  const handleAdd = () => {
    const result = addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      photo: product.photos?.[0] ?? null,
      size,
      quantity,
      stock: product.stock,
    });
    showToast(result.message, result.ok ? "success" : "error");
    if (result.ok) {
      setQuantity(1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 500);
    }
  };
  
  return (
    <div className="space-y-6">
      <p className="text-2xl font-bold text-ink-950">{formatPrice(product.price)}</p>

      {hasSizes && (
        <div>
          <p className="mb-2 text-sm font-semibold text-ink-950">Taille</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <motion.button
                key={s}
                onClick={() => setSize(s)}
                whileTap={{ scale: 0.92 }}
                className={clsx(
                  "flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-colors",
                  size === s
                    ? "border-ink-950 bg-ink-950 text-white"
                    : "border-ink-950/15 text-ink-900 hover:border-ink-950/40"
                )}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-semibold text-ink-950">Quantité</p>
        <div className="inline-flex items-center gap-1 rounded-xl border border-ink-950/15 p-1">
          <button
            onClick={decrement}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-ink-950/5"
            aria-label="Diminuer la quantité"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
          <button
            onClick={increment}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-ink-950/5"
            aria-label="Augmenter la quantité"
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="mt-1.5 text-xs text-ink-700/60">
          {outOfStock ? "Rupture de stock" : `${product.stock} en stock`}
        </p>
      </div>

      <motion.button
        onClick={handleAdd}
        disabled={outOfStock}
        whileTap={{ scale: 0.96 }}
        animate={justAdded ? { scale: [1, 1.04, 1] } : {}}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        <motion.span
          animate={justAdded ? { rotate: [0, -20, 12, 0] } : {}}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="flex"
        >
          <ShoppingBag size={18} />
        </motion.span>
        {outOfStock ? "Indisponible" : "Ajouter au panier"}
      </motion.button>
    </div>
  );
}