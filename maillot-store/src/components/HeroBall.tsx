"use client";

import { motion } from "framer-motion";

export default function HeroBall() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, rotate: -120, x: -40 }}
      animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto hidden aspect-square w-full max-w-xs items-center justify-center rounded-full border border-white/10 bg-white/[0.04] sm:flex lg:max-w-sm"
    >
      <motion.div
        className="absolute inset-6 rounded-full border border-dashed border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        className="text-7xl"
        animate={{ y: [0, -14, 0], rotate: [0, 12, -8, 0] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
        }}
      >
        ⚽
      </motion.span>
    </motion.div>
  );
}