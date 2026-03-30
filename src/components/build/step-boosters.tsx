"use client";

import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store/builder-store";
import type { Booster } from "@/types/database";
import { fadeUp, staggerContainer } from "@/components/shared/motion";

const BOOSTER_ICONS: Record<string, string> = {
  "extra-protein": "💪",
  creatine: "⚡",
  collagen: "✨",
  bcaas: "🧬",
};

interface StepBoostersProps {
  boosters: Booster[];
}

export function StepBoosters({ boosters }: StepBoostersProps) {
  const selectedBoosters = useBuilderStore((s) => s.selectedBoosters);
  const toggleBooster = useBuilderStore((s) => s.toggleBooster);

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
        <h2 className="font-heading text-xl font-bold text-foreground">Add Boosters</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Supercharge your smoothie. Select as many as you want.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {boosters.map((booster, i) => {
          const isSelected = selectedBoosters.some((b) => b.id === booster.id);
          return (
            <motion.button
              key={booster.id}
              variants={fadeUp}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleBooster(booster)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 rounded-2xl border p-5 transition-all shadow-soft",
                isSelected
                  ? "border-primary bg-primary/10 shadow-soft-lg"
                  : "border-border bg-white hover:border-primary/30 hover:shadow-soft-lg"
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary"
                >
                  <Check className="h-3 w-3 text-white" />
                </motion.div>
              )}
              {!isSelected && (
                <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border border-border">
                  <Plus className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
              <span className="text-2xl">{BOOSTER_ICONS[booster.slug] ?? "💊"}</span>
              <span className="font-semibold text-sm">{booster.name}</span>
              {booster.grams && (
                <span className="text-xs text-primary font-medium">
                  +{booster.grams}g
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                +{formatPrice(booster.price)}
              </span>
            </motion.button>
          );
        })}
      </div>

      {selectedBoosters.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-center text-primary font-medium"
        >
          {selectedBoosters.length} booster{selectedBoosters.length > 1 ? "s" : ""} selected &middot;{" "}
          +{formatPrice(selectedBoosters.reduce((sum, b) => sum + b.price, 0))}
        </motion.p>
      )}
    </motion.div>
  );
}
