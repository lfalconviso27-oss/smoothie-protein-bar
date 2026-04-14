"use client";

import { motion } from "framer-motion";
import { Droplets, Dumbbell, Zap, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store/builder-store";
import type { SmoothieType } from "@/types/database";
import { fadeUp, staggerContainer } from "@/components/shared/motion";

const TYPE_ICONS: Record<string, React.ElementType> = {
  basic: Droplets,
  fit: Dumbbell,
  power: Zap,
  vegan: Leaf,
};

const TYPE_COLORS: Record<string, string> = {
  basic: "text-blue-500",
  fit: "text-primary",
  power: "text-amber-500",
  vegan: "text-green-600",
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
        {types.map((type, i) => {
          const Icon = TYPE_ICONS[type.slug] ?? Droplets;
          const color = TYPE_COLORS[type.slug] ?? "text-primary";
          return (
            <motion.button
              key={type.id}
              variants={fadeUp}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(123,92,240,0.14)" }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setSmoothieType(type)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all shadow-soft",
                smoothieType?.id === type.id
                  ? "border-primary bg-primary/10 shadow-soft-lg"
                  : "border-border bg-white hover:border-primary/30 hover:shadow-soft-lg"
              )}
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-secondary", color === "text-primary" && "bg-primary/10")}>
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <span className="font-heading text-base font-bold">{type.name}</span>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                {type.description}
              </p>
              <div className="flex gap-3 mt-1 text-xs">
                <span className="font-bold text-primary">{type.protein}g protein</span>
                <span className="text-muted-foreground">{type.calories} cal</span>
              </div>
              <span className="text-sm font-bold mt-1">{formatPrice(type.base_price)}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
