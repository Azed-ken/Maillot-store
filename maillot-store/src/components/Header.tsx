"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import type { StoreSettings } from "@/lib/types";

const NAV_LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/catalogue?type=club", label: "Clubs" },
  { href: "/catalogue?type=selection", label: "Sélections" },
];

export default function Header({ settings }: { settings: StoreSettings }) {
  const [open, setOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  
  return (
    <header className="sticky top-0 z-50 border-b border-ink-950/5 bg-white/80 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          {settings.logo_url ? (
            <Image
              src={settings.logo_url}
              alt={settings.store_name}
              width={32}
              height={32}
              className="rounded-lg"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950 text-accent">
              ⚽
            </span>
          )}
          {settings.store_name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-ink-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/panier"
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ink-950/5"
            aria-label="Panier"
          >
            <motion.span
              key={totalItems > 0 ? "filled" : "empty"}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex"
            >
              <ShoppingBag size={20} />
            </motion.span>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1.3, 1], opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 14 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-ink-950"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ink-950/5 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-ink-950/5 md:hidden"
          >
            <div className="container-app flex flex-col gap-1 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-950/5"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}