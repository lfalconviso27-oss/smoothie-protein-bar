"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  Leaf,
  Check,
  Flame,
  Sun,
  Zap,
  Heart,
  Star,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store/builder-store";
import type { HydrationItem } from "@/types/database";
import { fadeUp, staggerContainer } from "@/components/shared/motion";

interface StepHydrationProps {
  items: HydrationItem[];
}

// Unique icon + color per flavor slug
const HYDRANT_ICON_MAP: Record<string, { icon: LucideIcon; color: string; bg: string; activeBg: string }> = {
  "hydrant-raspberry": { icon: Flame,  color: "text-rose-500",   bg: "bg-rose-50",   activeBg: "bg-rose-100"  },
  "hydrant-peach":     { icon: Sun,    color: "text-orange-400", bg: "bg-orange-50", activeBg: "bg-orange-100" },
  "hydrant-lemon":     { icon: Zap,    color: "text-yellow-500", bg: "bg-yellow-50", activeBg: "bg-yellow-100" },
};

const ALOE_ICON_MAP: Record<string, { icon: LucideIcon; color: string; bg: string; activeBg: string }> = {
  "aloe-cranberry": { icon: Heart, color: "text-red-500",   bg: "bg-red-50",   activeBg: "bg-red-100"   },
  "aloe-mango":     { icon: Star,  color: "text-amber-500", bg: "bg-amber-50", activeBg: "bg-amber-100" },
};

function getHydrantStyle(slug: string) {
  return HYDRANT_ICON_MAP[slug] ?? { icon: Droplets, color: "text-blue-400", bg: "bg-blue-50", activeBg: "bg-blue-100" };
}

function getAloeStyle(slug: string) {
  return ALOE_ICON_MAP[slug] ?? { icon: Leaf, color: "text-green-500", bg: "bg-green-50", activeBg: "bg-green-100" };
}

export function StepHydration({ items }: StepHydrationProps) {
  const hydrantFlavor = useBuilderStore((s) => s.hydrantFlavor);
  const aloeFlavor    = useBuilderStore((s) => s.aloeFlavor);
  const setHydrantFlavor = useBuilderStore((s) => s.setHydrantFlavor);
  const setAloeFlavor    = useBuilderStore((s) => s.setAloeFlavor);

  const hydrantItems = items.filter((i) => i.hydration_type === "hydrant");
  const aloeItems    = items.filter((i) => i.hydration_type === "aloe");

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

      {/* ── Hydrant ── */}
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            Hydrant
          </h3>
          <span className="text-xs text-muted-foreground font-medium">Pick one (optional)</span>
        </div>

        <button
          onClick={() => setHydrantFlavor(null)}
          className={cn(
            "w-full rounded-2xl border p-3 text-sm font-semibold transition-all text-left shadow-soft flex items-center gap-2",
            hydrantFlavor === null
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-white hover:border-primary/30"
          )}
        >
          {hydrantFlavor === null && <Check className="h-4 w-4 shrink-0" />}
          Skip Hydrant
        </button>

        <div className="grid grid-cols-3 gap-2">
          {hydrantItems.map((item, i) => {
            const style = getHydrantStyle(item.slug);
            const Icon  = style.icon;
            const isActive = hydrantFlavor?.id === item.id;
            return (
              <motion.button
                key={item.id}
                variants={fadeUp}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -3 }}
                onClick={() => setHydrantFlavor(item)}
                className={cn(
                  "flex flex-col items-center gap-2.5 rounded-2xl border p-4 transition-all shadow-soft",
                  isActive
                    ? "border-primary bg-primary/10 shadow-soft-lg"
                    : "border-border bg-white hover:border-primary/30 hover:shadow-soft-lg"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                  isActive ? style.activeBg : style.bg
                )}>
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary" : style.color)} />
                </div>
                <span className="font-semibold text-xs text-center leading-tight">{item.name}</span>
                <span className="text-[10px] text-green-600 font-semibold">Free</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-medium">+</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* ── Aloe ── */}
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-600" />
            Aloe
          </h3>
          <span className="text-xs text-muted-foreground font-medium">Pick one (optional)</span>
        </div>

        <button
          onClick={() => setAloeFlavor(null)}
          className={cn(
            "w-full rounded-2xl border p-3 text-sm font-semibold transition-all text-left shadow-soft flex items-center gap-2",
            aloeFlavor === null
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-white hover:border-primary/30"
          )}
        >
          {aloeFlavor === null && <Check className="h-4 w-4 shrink-0" />}
          Skip Aloe
        </button>

        <div className="grid grid-cols-2 gap-3">
          {aloeItems.map((item, i) => {
            const style = getAloeStyle(item.slug);
            const Icon  = style.icon;
            const isActive = aloeFlavor?.id === item.id;
            return (
              <motion.button
                key={item.id}
                variants={fadeUp}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -3 }}
                onClick={() => setAloeFlavor(item)}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all shadow-soft",
                  isActive
                    ? "border-primary bg-primary/10 shadow-soft-lg"
                    : "border-border bg-white hover:border-primary/30 hover:shadow-soft-lg"
                )}
              >
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
                  isActive ? style.activeBg : style.bg
                )}>
                  <Icon className={cn("h-6 w-6", isActive ? "text-primary" : style.color)} />
                </div>
                <span className="font-semibold text-sm text-center">{item.name}</span>
                <span className="text-xs text-green-600 font-semibold">Free</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Summary */}
      {(hydrantFlavor || aloeFlavor) && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-3 text-sm"
        >
          <Check className="h-5 w-5 text-primary shrink-0" />
          <div className="text-sm">
            {hydrantFlavor && (
              <span className="font-medium text-foreground">
                Hydrant: <span className="text-primary font-semibold">{hydrantFlavor.name}</span>
              </span>
            )}
            {hydrantFlavor && aloeFlavor && (
              <span className="text-muted-foreground mx-2">·</span>
            )}
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
