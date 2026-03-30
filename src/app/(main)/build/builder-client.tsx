"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useBuilderStore } from "@/lib/store/builder-store";
import { useCartStore } from "@/lib/store/cart-store";
import { StepHydration } from "@/components/build/step-hydration";
import { StepType } from "@/components/build/step-type";
import { StepBoosters } from "@/components/build/step-boosters";
import { StepFlavor } from "@/components/build/step-flavor";
import { NutritionSummary } from "@/components/build/nutrition-summary";
import { cn } from "@/lib/utils";
import type { BuilderData } from "@/lib/actions/menu";
import type { SmoothieBuildDetails } from "@/types/cart";

const STEP_LABELS = ["Hydrant + Aloe", "Type", "Boosters", "Flavor"];

interface BuilderClientProps {
  data: BuilderData;
}

export function BuilderClient({ data }: BuilderClientProps) {
  const router = useRouter();
  const step = useBuilderStore((s) => s.step);
  const canProceed = useBuilderStore((s) => s.canProceed());
  const nextStep = useBuilderStore((s) => s.nextStep);
  const prevStep = useBuilderStore((s) => s.prevStep);
  const reset = useBuilderStore((s) => s.reset);

  // Always start fresh — prevents stale in-memory state from a previous session
  useEffect(() => {
    reset();
  }, [reset]);

  const smoothieType = useBuilderStore((s) => s.smoothieType);
  const flavor = useBuilderStore((s) => s.flavor);
  const selectedBoosters = useBuilderStore((s) => s.selectedBoosters);
  const hydrantFlavor = useBuilderStore((s) => s.hydrantFlavor);
  const aloeFlavor = useBuilderStore((s) => s.aloeFlavor);
  const totalCalories = useBuilderStore((s) => s.totalCalories());
  const totalProtein = useBuilderStore((s) => s.totalProtein());
  const totalPrice = useBuilderStore((s) => s.totalPrice());
  const buildName = useBuilderStore((s) => s.buildName());

  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart() {
    if (!smoothieType || !flavor) return;

    const details: SmoothieBuildDetails = {
      smoothieTypeId: smoothieType.id,
      smoothieTypeName: smoothieType.name,
      flavorId: flavor.id,
      flavorName: flavor.name,
      flavorCategory: flavor.category.name,
      boosterIds: selectedBoosters.map((b) => b.id),
      boosterNames: selectedBoosters.map((b) => b.name),
      hydrantFlavorId: hydrantFlavor?.id,
      hydrantFlavorName: hydrantFlavor?.name,
      aloeFlavorId: aloeFlavor?.id,
      aloeFlavorName: aloeFlavor?.name,
    };

    addItem({
      productType: "smoothie",
      name: buildName,
      quantity: 1,
      unitPrice: totalPrice,
      details,
      nutrition: { calories: totalCalories, protein: totalProtein },
    });

    toast.success(`${buildName} added to cart!`);
    reset();
    router.push("/cart");
  }

  const isLastStep = step === 4;
  const canAddToCart = smoothieType !== null && flavor !== null;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6 pb-36">
      {/* Step indicator */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={cn(
                  "h-1.5 w-full rounded-full transition-colors duration-300",
                  i + 1 <= step ? "bg-primary" : "bg-secondary"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-semibold transition-colors text-center leading-tight",
                  i + 1 === step
                    ? "text-primary"
                    : i + 1 < step
                      ? "text-foreground"
                      : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Current step label */}
        <p className="text-xs text-muted-foreground text-center">
          Step {step} of {STEP_LABELS.length} — <span className="text-primary font-semibold">{STEP_LABELS[step - 1]}</span>
        </p>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {step === 1 && <StepHydration items={data.hydrationItems} />}
          {step === 2 && <StepType types={data.smoothieTypes} />}
          {step === 3 && <StepBoosters boosters={data.boosters} />}
          {step === 4 && (
            <StepFlavor
              categories={data.flavorCategories}
              flavors={data.flavors}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nutrition summary */}
      <NutritionSummary />

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/95 backdrop-blur-xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:static md:border-0 md:bg-transparent md:backdrop-blur-none md:p-0">
        <div className="flex flex-col gap-2 max-w-lg mx-auto">
          {/* Hint when blocked */}
          {!canProceed && !isLastStep && (
            <p className="text-center text-xs text-muted-foreground">
              {step === 2 && "↑ Select a smoothie type above to continue"}
            </p>
          )}
          {isLastStep && !canAddToCart && (
            <p className="text-center text-xs text-muted-foreground">
              {!smoothieType ? "↑ Go back and select a smoothie type" : "↑ Select a flavor above to add to cart"}
            </p>
          )}

          <div className="flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1 rounded-2xl"
                onClick={prevStep}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}

            {isLastStep ? (
              <Button
                size="lg"
                className="flex-1 font-bold rounded-2xl"
                disabled={!canAddToCart}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            ) : (
              <Button
                size="lg"
                className="flex-1 font-bold rounded-2xl"
                disabled={!canProceed}
                onClick={nextStep}
              >
                {step === 1 ? "Skip / Continue" : "Next"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
