"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store/builder-store";
import type { HydrationItem } from "@/types/database";
import { fadeUp, staggerContainer } from "@/components/shared/motion";

const HYDRANT_ICONS: Record<string, string> = {
  "hydrant-raspberry": "🍇",
  "hydrant-peach": "🍑",
  "hydrant-lemon": "🍋",
};

const ALOE_ICONS: Record<string, string> = {
  "aloe-cranberry": "🍒",
  "aloe-mango": "🥭",
};

interface StepHydrationProps {
  items: HydrationItem[];
}

export function StepHydration({ items }: StepHydrationProps) {
  const hydrantFlavor = useBuilderStore((s) => s.hydrantFlavor);
  const aloeFlavor = useBuilderStore((s) => s.aloeFlavor);
  const setHydrantFlavor = useBuilderStore((s) => s.setHydrantFlavor);
  const setAloeFlavor = useBuilderStore((s) => s.setAloeFlavor);

  const hydrantItems = items.filter((i) => i.hydration_type === "hydrant");
  const aloeItems = items.filter((i) => i.hydration_type === "aloe");

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
        <h2 className="font-heading text-xl font-bold text-foreground">Hydrant + Aloe</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose your Hydrant flavor and Aloe flavor. Both are optional — included free.
        </p>
      </motion.div>

      {/* Hydrant section */}
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base flex items-center gap-2">
            <span className="text-lg">💧</span> Hydrant
          </h3>
          <span className="text-xs text-muted-foreground font-medium">Pick one (optional)</span>
        </div>

        {/* Skip hydrant */}
        <button
          onClick={() => setHydrantFlavor(null)}
          className={cn(
            "w-full rounded-2xl border p-3 text-sm font-medium transition-all text-left shadow-soft",
            hydrantFlavor === null
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-white hover:border-primary/30"
          )}
        >
          Skip Hydrant
        </button>

        <div className="grid grid-cols-3 gap-2">
          {hydrantItems.map((item, i) => (
            <motion.button
              key={item.id}
              variants={fadeUp}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setHydrantFlavor(item)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all shadow-soft",
                hydrantFlavor?.id === item.id
                  ? "border-primary bg-primary/10 shadow-soft-lg"
                  : "border-border bg-white hover:border-primary/30 hover:shadow-soft-lg"
              )}
            >
              <span className="text-2xl">{HYDRANT_ICONS[item.slug] ?? "💧"}</span>
              <span className="font-semibold text-xs text-center leading-tight">{item.name}</span>
              <span className="text-[10px] text-green-600 font-semibold">Free</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-medium">+</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Aloe section */}
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base flex items-center gap-2">
            <span className="text-lg">🌿</span> Aloe
          </h3>
          <span className="text-xs text-muted-foreground font-medium">Pick one (optional)</span>
        </div>

        {/* Skip aloe */}
        <button
          onClick={() => setAloeFlavor(null)}
          className={cn(
            "w-full rounded-2xl border p-3 text-sm font-medium transition-all text-left shadow-soft",
            aloeFlavor === null
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-white hover:border-primary/30"
          )}
        >
          Skip Aloe
        </button>

        <div className="grid grid-cols-2 gap-3">
          {aloeItems.map((item, i) => (
            <motion.button
              key={item.id}
              variants={fadeUp}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setAloeFlavor(item)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all shadow-soft",
                aloeFlavor?.id === item.id
                  ? "border-primary bg-primary/10 shadow-soft-lg"
                  : "border-border bg-white hover:border-primary/30 hover:shadow-soft-lg"
              )}
            >
              <span className="text-3xl">{ALOE_ICONS[item.slug] ?? "🌿"}</span>
              <span className="font-semibold text-sm text-center">{item.name}</span>
              <span className="text-xs text-green-600 font-semibold">Free</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Summary of selection */}
      {(hydrantFlavor || aloeFlavor) && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-3 text-sm"
        >
          <span className="text-lg">✅</span>
          <div className="text-sm">
            {hydrantFlavor && (
              <span className="font-medium text-foreground">
                Hydrant: <span className="text-primary font-semibold">{hydrantFlavor.name}</span>
              </span>
            )}
            {hydrantFlavor && aloeFlavor && <span className="text-muted-foreground mx-2">·</span>}
            {aloeFlavor && (
              <span className="font-medium text-foreground">
                Aloe: <span className="text-primary font-semibold">{aloeFlavor.name}</span>
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
