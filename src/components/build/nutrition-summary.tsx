"use client";

import { motion } from "framer-motion";
import { Droplets, Leaf, CupSoda, Sparkles } from "lucide-react";
import { useBuilderStore } from "@/lib/store/builder-store";
import { formatPrice } from "@/lib/utils";

export function NutritionSummary() {
  const totalCalories = useBuilderStore((s) => s.totalCalories());
  const totalProtein = useBuilderStore((s) => s.totalProtein());
  const totalPrice = useBuilderStore((s) => s.totalPrice());
  const smoothieType = useBuilderStore((s) => s.smoothieType);
  const selectedBoosters = useBuilderStore((s) => s.selectedBoosters);
  const hydrantFlavor = useBuilderStore((s) => s.hydrantFlavor);
  const aloeFlavor = useBuilderStore((s) => s.aloeFlavor);
  const flavor = useBuilderStore((s) => s.flavor);

  const hasAnything = smoothieType || hydrantFlavor || aloeFlavor;

  return (
    <motion.div
      className="rounded-2xl border border-border bg-white p-4 space-y-3 shadow-soft"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Live Nutrition
      </h3>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-secondary p-3 text-center">
          <motion.p
            key={totalCalories}
            initial={{ scale: 1.2, color: "#7B5CF0" }}
            animate={{ scale: 1, color: "#1a1a2e" }}
            className="text-xl font-bold font-heading"
          >
            {totalCalories}
          </motion.p>
          <p className="text-xs text-muted-foreground">Calories</p>
        </div>
        <div className="rounded-2xl bg-secondary p-3 text-center">
          <motion.p
            key={totalProtein}
            initial={{ scale: 1.2, color: "#7B5CF0" }}
            animate={{ scale: 1, color: "#1a1a2e" }}
            className="text-xl font-bold font-heading"
          >
            {totalProtein}g
          </motion.p>
          <p className="text-xs text-muted-foreground">Protein</p>
        </div>
        <div className="rounded-2xl bg-secondary p-3 text-center">
          <motion.p
            key={totalPrice}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-xl font-bold font-heading text-primary"
          >
            {hasAnything ? formatPrice(totalPrice) : "—"}
          </motion.p>
          <p className="text-xs text-muted-foreground">Price</p>
        </div>
      </div>

      {/* Build summary */}
      {hasAnything && (
        <div className="text-xs text-muted-foreground space-y-1.5 pt-1 border-t border-border">
          {hydrantFlavor && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Droplets className="h-3 w-3 text-blue-400" />
                Hydrant {hydrantFlavor.name}
              </span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
          )}
          {aloeFlavor && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Leaf className="h-3 w-3 text-green-500" />
                Aloe {aloeFlavor.name}
              </span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
          )}
          {smoothieType && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CupSoda className="h-3 w-3 text-primary" />
                {smoothieType.name} smoothie
              </span>
              <span>{formatPrice(smoothieType.base_price)}</span>
            </div>
          )}
          {flavor && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary/60" />
                {flavor.name}
              </span>
              <span className="text-muted-foreground">included</span>
            </div>
          )}
          {selectedBoosters.map((b) => (
            <div key={b.id} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 inline-flex items-center justify-center rounded-full bg-primary/20 text-[8px] font-bold text-primary">+</span>
                {b.name}
              </span>
              <span>{formatPrice(b.price)}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
