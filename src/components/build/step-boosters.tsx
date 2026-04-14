"use client";

import { motion } from "framer-motion";
import { Check, Plus, Dumbbell, Zap, Sparkles, Dna, Pill, Heart, Shield, Flame, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store/builder-store";
import type { Booster } from "@/types/database";
import { fadeUp, staggerContainer } from "@/components/shared/motion";

const BOOSTER_ICONS: Record<string, React.ElementType> = {
  "extra-protein": Dumbbell,
  protein: Dumbbell,
  creatine: FlaskConical,
  collagen: Sparkles,
  bcaas: Dna,
  energy: Flame,
  fiber: Pill,
  probiotic: Shield,
  "healthy-heart": Heart,
  "immune-system": Shield,
  guarana: Zap,
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
          const Icon = BOOSTER_ICONS[booster.slug] ?? Pill;
          return (
            <motion.button
              key={booster.id}
              variants={fadeUp}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              whileHover={{ y: -3, boxShadow: "0 6px 20px rgba(123,92,240,0.15)" }}
              whileTap={{ scale: 0.93 }}
              onClick={() => toggleBooster(booster)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all shadow-soft",
                isSelected
                  ? "border-primary bg-primary/10 shadow-soft-lg"
                  : "border-border bg-white hover:border-primary/30 hover:shadow-soft-lg"
              )}
            >
              {isSelected ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary"
                >
                  <Check className="h-3 w-3 text-white" />
                </motion.div>
              ) : (
                <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border border-border">
                  <Plus className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                isSelected ? "bg-primary/20" : "bg-secondary"
              )}>
                <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
              </div>
              <span className="font-semibold text-sm text-center">{booster.name}</span>
              {booster.grams && (
                <span className="text-xs text-primary font-medium">+{booster.grams}g</span>
              )}
              <span className="text-xs text-muted-foreground">+{formatPrice(booster.price)}</span>
            </motion.button>
          );
        })}
      </div>

      {selectedBoosters.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-center text-primary font-semibold"
        >
          {selectedBoosters.length} booster{selectedBoosters.length > 1 ? "s" : ""} selected &middot;{" "}
          +{formatPrice(selectedBoosters.reduce((sum, b) => sum + b.price, 0))}
        </motion.p>
      )}
    </motion.div>
  );
}
