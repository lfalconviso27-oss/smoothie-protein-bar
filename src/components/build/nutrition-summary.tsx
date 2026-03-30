"use client";

import { motion } from "framer-motion";
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
      <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Live Nutrition
      </h3>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-secondary p-3 text-center">
          <motion.p
            key={totalCalories}
            initial={{ scale: 1.2, color: "#7B5CF0" }}
            animate={{ scale: 1, color: "#1a1a2e" }}
            className="text-xl font-bold"
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
            className="text-xl font-bold"
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
            className="text-xl font-bold text-primary"
          >
            {hasAnything ? formatPrice(totalPrice) : "—"}
          </motion.p>
          <p className="text-xs text-muted-foreground">Price</p>
        </div>
      </div>

      {/* Build summary */}
      {hasAnything && (
        <div className="text-xs text-muted-foreground space-y-1 pt-1 border-t border-border">
          {hydrantFlavor && (
            <div className="flex justify-between">
              <span>💧 Hydrant {hydrantFlavor.name}</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          )}
          {aloeFlavor && (
            <div className="flex justify-between">
              <span>🌿 Aloe {aloeFlavor.name}</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          )}
          {smoothieType && (
            <div className="flex justify-between">
              <span>🥤 {smoothieType.name} smoothie</span>
              <span>{formatPrice(smoothieType.base_price)}</span>
            </div>
          )}
          {flavor && (
            <div className="flex justify-between">
              <span>✨ {flavor.name}</span>
              <span className="text-muted-foreground">included</span>
            </div>
          )}
          {selectedBoosters.map((b) => (
            <div key={b.id} className="flex justify-between">
              <span>+ {b.name}</span>
              <span>{formatPrice(b.price)}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
