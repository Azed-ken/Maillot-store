import { SearchX } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-ink-950/10 bg-ink-950/[0.015] py-24 text-center">
        <SearchX size={32} className="text-ink-950/25" strokeWidth={1.5} />
        <p className="text-sm font-medium text-ink-700">Aucun maillot ne correspond à ta recherche.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}