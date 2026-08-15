"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";

const LINKS = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: ShoppingBag },
  { href: "/admin/categories", label: "Catégories", icon: Tags },
  { href: "/admin/commandes", label: "Commandes", icon: ClipboardList },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 gap-1 overflow-x-auto border-b border-ink-950/5 bg-white p-3 md:w-60 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:p-4">
      {LINKS.map((link) => {
        const Icon = link.icon;
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors md:shrink",
              active ? "bg-ink-950 text-white" : "text-ink-700 hover:bg-ink-950/5"
            )}
          >
            <Icon size={17} />
            {link.label}
          </Link>
        );
      })}

      <form action={signOut} className="shrink-0 md:mt-auto">
        <button className="flex w-full items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
          <LogOut size={17} />
          Déconnexion
        </button>
      </form>
    </aside>
  );
}
