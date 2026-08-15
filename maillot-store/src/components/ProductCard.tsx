"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Shirt } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { KIND_LABELS, type Product } from "@/lib/types";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index ? : number;
}) {
  const photo = product.photos?.[0];
  const outOfStock = product.stock <= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: Math.min(index, 8) * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/produit/${product.slug}`} className="group block">
        <motion.div
          className="relative aspect-[4/5] overflow-hidden rounded-xl2 border border-ink-950/[0.06] bg-ink-800/[0.03] shadow-card"
          whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {photo ? (
            <Image
              src={photo}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-950/15">
              <Shirt size={56} strokeWidth={1.25} />
            </div>
          )}

          <div className="absolute left-3 top-3 flex gap-1.5">
            {product.is_new && (
              <motion.span
                initial={{ scale: 0, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.15 }}
                className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-ink-950"
              >
                Nouveau
              </motion.span>
            )}
            {product.is_popular && (
              <motion.span
                initial={{ scale: 0, rotate: 8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.22 }}
                className="rounded-full bg-ink-950 px-2.5 py-1 text-[11px] font-bold text-white"
              >
                Populaire
              </motion.span>
            )}
          </div>

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
              <span className="rounded-full bg-ink-950 px-3 py-1.5 text-xs font-semibold text-white">
                Rupture de stock
              </span>
            </div>
          )}
        </motion.div>

        <div className="mt-3 space-y-0.5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-700/60">
            {KIND_LABELS[product.kind]}
          </p>
          <h3 className="line-clamp-1 text-sm font-semibold text-ink-950">{product.name}</h3>
          <p className="text-sm font-bold text-ink-950">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}