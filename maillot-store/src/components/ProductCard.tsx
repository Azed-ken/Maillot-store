import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { KIND_LABELS, type Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const photo = product.photos?.[0];
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group block animate-fade-up"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl2 bg-ink-800/5">
        {photo ? (
          <Image
            src={photo}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">👕</div>
        )}

        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.is_new && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-ink-950">
              Nouveau
            </span>
          )}
          {product.is_popular && (
            <span className="rounded-full bg-ink-950 px-2.5 py-1 text-[11px] font-bold text-white">
              Populaire
            </span>
          )}
        </div>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <span className="rounded-full bg-ink-950 px-3 py-1.5 text-xs font-semibold text-white">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-0.5">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-700/60">
          {KIND_LABELS[product.kind]}
        </p>
        <h3 className="line-clamp-1 text-sm font-semibold text-ink-950">{product.name}</h3>
        <p className="text-sm font-bold text-ink-950">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
