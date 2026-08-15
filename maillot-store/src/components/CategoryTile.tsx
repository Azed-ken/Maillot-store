"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Plane, Star } from "lucide-react";

const ICONS = {
  home: Home,
  plane: Plane,
  star: Star,
} as const;

export type CategoryIconKey = keyof typeof ICONS;

export default function CategoryTile({
  href,
  label,
  icon,
  index,
}: {
  href: string;
  label: string;
  icon: CategoryIconKey;
  index: number;
}) {
  const Icon = ICONS[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
    >
      <Link href={href} className="card-surface group flex flex-col items-center gap-3 py-7 text-center">
        <motion.span
          className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent-dark"
          whileHover={{
            scale: 1.12,
            rotate: [0, -14, 10, 0],
            backgroundColor: "#00e07a",
            color: "#0a0b0d",
          }}
          whileTap={{ scale: 0.9, rotate: 20 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          <Icon size={20} />
        </motion.span>
        <span className="text-sm font-semibold transition-colors group-hover:text-ink-950">{label}</span>
      </Link>
    </motion.div>
  );
}