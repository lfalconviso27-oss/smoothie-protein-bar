"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { setGoal } from "@/lib/actions/goals";
import { FITNESS_GOALS, type FitnessGoal } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface GoalsClientProps {
  currentGoal: string | null;
  profile: Profile | null;
}

export function GoalsClient({ currentGoal, profile }: GoalsClientProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<FitnessGoal | null>(
    (currentGoal as FitnessGoal) ?? null
  );
  const [pending, setPending] = useState(false);

  async function handleSave() {
    if (!selected) return;
    setPending(true);
    try {
      await setGoal(selected);
      toast.success("Goal set! Check your recommendations.");
      router.push("/goals/recommendations");
    } catch {
      toast.error("Failed to save goal");
    }
    setPending(false);
  }

  const targets = selected ? FITNESS_GOALS[selected] : null;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      <motion.div
        className="space-y-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-heading text-2xl font-bold">Fitness Goals</h1>
        <p className="text-sm text-muted-foreground">
          Tell us your goal and we&apos;ll recommend the perfect smoothies.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {(Object.entries(FITNESS_GOALS) as [FitnessGoal, (typeof FITNESS_GOALS)[FitnessGoal]][]).map(
          ([key, goal], i) => (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(key)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all shadow-soft",
                selected === key
                  ? "border-primary bg-primary/10 shadow-soft-lg"
                  : "border-border bg-white hover:border-primary/30 hover:shadow-soft-lg"
              )}
            >
              <span className="text-3xl">{goal.emoji}</span>
              <span className="font-heading font-bold">{goal.label}</span>
              <span className="text-xs text-muted-foreground text-center">
                {goal.description}
              </span>
            </motion.button>
          )
        )}
      </div>

      <AnimatePresence mode="wait">
        {targets && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-border bg-white p-4 space-y-3 shadow-soft">
              <h2 className="font-heading font-semibold">Daily Targets</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold">{targets.calories}</p>
                  <p className="text-xs text-muted-foreground">Calories</p>
                </div>
                <div className="rounded-2xl bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{targets.protein}g</p>
                  <p className="text-xs text-muted-foreground">Protein</p>
                </div>
                <div className="rounded-2xl bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold text-purple">{targets.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                </div>
                <div className="rounded-2xl bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold text-amber-500">{targets.fat}g</p>
                  <p className="text-xs text-muted-foreground">Fat</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {profile && (
        <div className="text-xs text-center text-muted-foreground">
          Loyalty: {profile.loyalty_points} points ({profile.loyalty_tier})
        </div>
      )}

      <Button
        size="lg"
        className="w-full text-base font-bold h-12 rounded-2xl"
        onClick={handleSave}
        disabled={!selected || pending}
      >
        {pending ? "Saving..." : selected ? `Set ${FITNESS_GOALS[selected].label} Goal` : "Select a Goal"}
      </Button>
    </div>
  );
}
