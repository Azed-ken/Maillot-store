import Link from "next/link";
import { ArrowRight, Home, Plane, Star, Sparkles, Flame } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getStoreSettings } from "@/lib/settings";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/lib/types";

export const revalidate = 60;

const CATEGORY_TILES = [
  { href: "/catalogue?kind=domicile", label: "Domicile", icon: Home },
  { href: "/catalogue?kind=exterieur", label: "Extérieur", icon: Plane },
  { href: "/catalogue?kind=third", label: "Third", icon: Star },
];

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
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 26px)",
          }}
        />

        <div className="container-app relative flex flex-col justify-center gap-8 py-16 text-white sm:py-20 lg:min-h-[64vh] lg:flex-row lg:items-center lg:py-24">
          <div className="max-w-xl">
            <p className="animate-fade-up inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              <Sparkles size={13} /> Maillots authentiques
            </p>
            <h1
              className="mt-5 animate-fade-up font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
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
              <Link
                href="/catalogue?type=selection"
                className="btn-secondary !border-white/20 !bg-transparent !text-white hover:!border-white/50"
              >
                Sélections nationales
              </Link>
            </div>
          </div>

          {/* Vignette décorative : évite le grand aplat noir vide sur mobile/desktop */}
          <div
            className="animate-fade-up relative mx-auto hidden aspect-square w-full max-w-xs items-center justify-center rounded-full border border-white/10 bg-white/[0.04] sm:flex lg:max-w-sm"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="absolute inset-6 rounded-full border border-dashed border-white/10" />
            <span className="text-7xl">⚽</span>
          </div>
        </div>
      </section>

      {/* CATEGORIES RAPIDES */}
      <section className="container-app py-10 sm:py-14">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {CATEGORY_TILES.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.label}
                href={c.href}
                className="card-surface group flex flex-col items-center gap-3 py-7 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-soft"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent-dark transition-colors group-hover:bg-accent group-hover:text-ink-950">
                  <Icon size={20} />
                </span>
                <span className="text-sm font-semibold">{c.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* NOUVEAUTÉS */}
      {!!newProducts?.length && (
        <section className="container-app py-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-accent-dark">
                <Sparkles size={13} /> Fraîchement arrivés
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Nouveautés</h2>
            </div>
            <Link href="/catalogue" className="text-sm font-semibold text-ink-700 hover:text-ink-950">
              Tout voir
            </Link>
          </div>
          <ProductGrid products={newProducts as Product[]} />
        </section>
      )}

      {/* POPULAIRES — bande légèrement teintée pour casser le tout-blanc */}
      {!!popularProducts?.length && (
        <section className="mt-6 bg-ink-950/[0.02] py-12">
          <div className="container-app">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-accent-dark">
                  <Flame size={13} /> Les préférés
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Maillots populaires</h2>
              </div>
              <Link href="/catalogue" className="text-sm font-semibold text-ink-700 hover:text-ink-950">
                Tout voir
              </Link>
            </div>
            <ProductGrid products={popularProducts as Product[]} />
          </div>
        </section>
      )}

      {/* BANDE CTA FINALE */}
      <section className="bg-ink-950 py-14 text-center text-white">
        <div className="container-app">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Ton maillot t&apos;attend
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
            Parcours le catalogue complet et commande en quelques secondes, directement sur WhatsApp.
          </p>
          <Link href="/catalogue" className="btn-accent mt-6 inline-flex">
            Voir le catalogue <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}