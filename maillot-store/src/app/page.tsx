import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getStoreSettings } from "@/lib/settings";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const settings = await getStoreSettings();

  const [{ data: newProducts }, { data: popularProducts }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_new", true)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_popular", true)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-950">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="container-app relative flex min-h-[70vh] flex-col justify-center py-24 text-white">
          <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Maillots authentiques
          </p>
          <h1
            className="mt-4 max-w-2xl animate-fade-up font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
            style={{ animationDelay: "0.08s" }}
          >
            {settings.store_name}
          </h1>
          <p
            className="mt-5 max-w-md animate-fade-up text-base text-white/70"
            style={{ animationDelay: "0.16s" }}
          >
            {settings.slogan}
          </p>
          <div
            className="mt-8 flex animate-fade-up flex-wrap gap-3"
            style={{ animationDelay: "0.24s" }}
          >
            <Link href="/catalogue" className="btn-accent">
              Voir les maillots <ArrowRight size={16} />
            </Link>
            <Link href="/catalogue?type=selection" className="btn-secondary !border-white/20 !bg-transparent !text-white hover:!border-white/50">
              Sélections nationales
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES RAPIDES */}
      <section className="container-app py-12">
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: "/catalogue?kind=domicile", label: "Domicile", emoji: "🏠" },
            { href: "/catalogue?kind=exterieur", label: "Extérieur", emoji: "✈️" },
            { href: "/catalogue?kind=third", label: "Third", emoji: "⭐" },
          ].map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="card-surface flex flex-col items-center gap-2 py-6 text-center transition-transform hover:-translate-y-0.5"
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-sm font-semibold">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* NOUVEAUTÉS */}
      {!!newProducts?.length && (
        <section className="container-app py-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold">Nouveautés</h2>
            <Link href="/catalogue" className="text-sm font-semibold text-ink-700 hover:text-ink-950">
              Tout voir
            </Link>
          </div>
          <ProductGrid products={newProducts as Product[]} />
        </section>
      )}

      {/* POPULAIRES */}
      {!!popularProducts?.length && (
        <section className="container-app py-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold">Maillots populaires</h2>
            <Link href="/catalogue" className="text-sm font-semibold text-ink-700 hover:text-ink-950">
              Tout voir
            </Link>
          </div>
          <ProductGrid products={popularProducts as Product[]} />
        </section>
      )}
    </div>
  );
}
