import Link from "next/link";
import { Search } from "lucide-react";
import clsx from "clsx";
import type { Category } from "@/lib/types";

export interface CatalogueSearchParams {
  q ? : string;
  type ? : string;
  kind ? : string;
  category ? : string;
  sort ? : string;
}

interface Props {
  categories: Category[];
  searchParams: CatalogueSearchParams;
}

function buildHref(current: CatalogueSearchParams, patch: CatalogueSearchParams) {
  const params = new URLSearchParams();
  const merged: CatalogueSearchParams = { ...current, ...patch };
  (Object.entries(merged) as[string, string | undefined][]).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();
  return qs ? `/catalogue?${qs}` : "/catalogue";
}

export default function CatalogueFilters({ categories, searchParams }: Props) {
  const clubs = categories.filter((c) => c.type === "club");
  const selections = categories.filter((c) => c.type === "selection");
  
  return (
    <div className="space-y-5 rounded-xl2 border border-ink-950/[0.06] bg-ink-950/[0.015] p-4 sm:p-5">
      <form action="/catalogue" method="get" className="relative">
        {Object.entries(searchParams).map(([key, value]) =>
          key !== "q" && value ? (
            <input key={key} type="hidden" name={key} value={value} />
          ) : null
        )}
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-700/50" />
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q || ""}
          placeholder="Rechercher un maillot, un club..."
          className="input-field !bg-white pl-10"
        />
      </form>

      <div className="flex flex-wrap gap-2">
        <FilterPill href={buildHref(searchParams, { type: undefined })} active={!searchParams.type} label="Tous" />
        <FilterPill href={buildHref(searchParams, { type: "club" })} active={searchParams.type === "club"} label="Clubs" />
        <FilterPill href={buildHref(searchParams, { type: "selection" })} active={searchParams.type === "selection"} label="Sélections" />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterPill href={buildHref(searchParams, { kind: undefined })} active={!searchParams.kind} label="Toutes catégories" />
        <FilterPill href={buildHref(searchParams, { kind: "domicile" })} active={searchParams.kind === "domicile"} label="Domicile" />
        <FilterPill href={buildHref(searchParams, { kind: "exterieur" })} active={searchParams.kind === "exterieur"} label="Extérieur" />
        <FilterPill href={buildHref(searchParams, { kind: "third" })} active={searchParams.kind === "third"} label="Third" />
      </div>

      {(clubs.length > 0 || selections.length > 0) && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[...clubs, ...selections].map((cat) => (
            <FilterPill
              key={cat.id}
              href={buildHref(searchParams, { category: searchParams.category === cat.slug ? undefined : cat.slug })}
              active={searchParams.category === cat.slug}
              label={`${cat.country_flag ? cat.country_flag + " " : ""}${cat.name}`}
              nowrap
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-ink-700/60">Trier par</p>
        <div className="flex gap-1">
          <FilterPill href={buildHref(searchParams, { sort: undefined })} active={!searchParams.sort} label="Pertinence" small />
          <FilterPill href={buildHref(searchParams, { sort: "price_asc" })} active={searchParams.sort === "price_asc"} label="Prix ↑" small />
          <FilterPill href={buildHref(searchParams, { sort: "price_desc" })} active={searchParams.sort === "price_desc"} label="Prix ↓" small />
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  href,
  active,
  label,
  small,
  nowrap,
}: {
  href: string;
  active: boolean;
  label: string;
  small ? : boolean;
  nowrap ? : boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "rounded-full border font-medium transition-all duration-150 active:scale-90",
        small ? "px-3 py-1 text-xs" : "px-3.5 py-2 text-sm",
        nowrap && "shrink-0",
        active
          ? "border-accent bg-accent text-ink-950"
          : "border-ink-950/10 bg-white text-ink-700 hover:border-ink-950/30"
      )}
    >
      {label}
    </Link>
  );
}