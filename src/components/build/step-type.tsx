"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store/builder-store";
import type { SmoothieType } from "@/types/database";
import { fadeUp, staggerContainer } from "@/components/shared/motion";

const TYPE_ICONS: Record<string, string> = {
  basic: "💧",
  fit: "💪",
  power: "⚡",
  vegan: "🌱",
};

interface StepTypeProps {
  types: SmoothieType[];
}

export function StepType({ types }: StepTypeProps) {
  const smoothieType = useBuilderStore((s) => s.smoothieType);
  const setSmoothieType = useBuilderStore((s) => s.setSmoothieType);

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
        <h2 className="font-heading text-xl font-bold text-foreground">Choose Your Base</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your smoothie starts here. Each type has different macros.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {types.map((type, i) => (
          <motion.button
            key={type.id}
            variants={fadeUp}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSmoothieType(type)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all shadow-soft",
              smoothieType?.id === type.id
                ? "border-primary bg-primary/10 shadow-soft-lg"
                : "border-border bg-white hover:border-primary/30 hover:shadow-soft-lg"
            )}
          >
            <span className="text-3xl">{TYPE_ICONS[type.slug] ?? "🥤"}</span>
            <span className="font-heading text-lg font-bold">{type.name}</span>
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              {type.description}
            </p>
            <div className="flex gap-3 mt-1 text-xs">
              <span className="font-semibold text-primary">{type.protein}g protein</span>
              <span className="text-muted-foreground">{type.calories} cal</span>
            </div>
            <span className="text-sm font-bold mt-1">{formatPrice(type.base_price)}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
