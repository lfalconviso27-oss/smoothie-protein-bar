"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useBuilderStore, type FlavorWithCategory } from "@/lib/store/builder-store";
import type { FlavorCategory } from "@/types/database";
import { fadeUp, staggerContainer } from "@/components/shared/motion";

interface StepFlavorProps {
  categories: FlavorCategory[];
  flavors: FlavorWithCategory[];
}

export function StepFlavor({ categories, flavors }: StepFlavorProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.slug ?? "");
  const selected = useBuilderStore((s) => s.flavor);
  const setFlavor = useBuilderStore((s) => s.setFlavor);

  const filteredFlavors = flavors.filter(
    (f) => f.category.slug === activeCategory
  );

  return (
    <motion.div
      className="space-y-5"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
        <h2 className="font-heading text-xl font-bold text-foreground">Pick Your Flavor</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {flavors.length} flavors across {categories.length} categories. Find your perfect match.
        </p>
      </motion.div>

      {/* Category tabs */}
      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.3 }}
        className="flex gap-2 overflow-x-auto pb-1 no-scrollbar"
      >
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
              activeCategory === cat.slug
                ? "bg-primary text-white shadow-soft"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
            <span className="text-xs opacity-60">
              ({flavors.filter((f) => f.category.slug === cat.slug).length})
            </span>
          </button>
        ))}
      </motion.div>

      {/* Flavor grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
        >
          {filteredFlavors.map((flavor) => (
            <motion.button
              key={flavor.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFlavor(flavor)}
              className={cn(
                "rounded-2xl border px-4 py-3.5 text-sm font-medium transition-all text-left shadow-soft",
                selected?.id === flavor.id
                  ? "border-primary bg-primary/10 text-primary shadow-soft-lg"
                  : "border-border bg-white hover:border-primary/30 hover:shadow-soft-lg"
              )}
            >
              {flavor.name}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-center"
        >
          Selected: <span className="font-bold text-primary">{selected.name}</span>
          <span className="text-muted-foreground"> ({selected.category.name})</span>
        </motion.div>
      )}
    </motion.div>
  );
}
