"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function AdminProductRow({ product }: { product: Product }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${product.name}" ?`)) return;
    setDeleting(true);
    await deleteProduct(product.id);
    router.refresh();
  };

  return (
    <tr className="border-b border-ink-950/5 text-sm last:border-0">
      <td className="py-3 pr-3">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-ink-800/5">
            {product.photos?.[0] ? (
              <Image src={product.photos[0]} alt="" fill sizes="44px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg">👕</div>
            )}
          </div>
          <div>
            <p className="line-clamp-1 font-medium">{product.name}</p>
            <p className="text-xs text-ink-700/50">{product.is_active ? "Visible" : "Masqué"}</p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-3 font-semibold">{formatPrice(product.price)}</td>
      <td className="py-3 pr-3">
        <span className={product.stock <= 0 ? "font-semibold text-red-500" : ""}>{product.stock}</span>
      </td>
      <td className="py-3 pr-3">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/produits/${product.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-950/5"
          >
            <Pencil size={15} />
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
