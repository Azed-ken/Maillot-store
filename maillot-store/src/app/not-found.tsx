import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-5xl">🧦</p>
      <h1 className="font-display text-xl font-bold">Page introuvable</h1>
      <p className="text-sm text-ink-700/70">Ce maillot n&apos;existe pas ou plus.</p>
      <Link href="/catalogue" className="btn-primary mt-2">
        Retour au catalogue
      </Link>
    </div>
  );
}
