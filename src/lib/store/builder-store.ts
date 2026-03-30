import { create } from "zustand";
import type {
  SmoothieType,
  FlavorCategory,
  Booster,
  HydrationItem,
} from "@/types/database";
import type { FlavorWithCategory } from "@/lib/actions/menu";

export type { FlavorWithCategory };

export interface BuilderState {
  // Step: 1=Hydrant+Aloe, 2=Type, 3=Boosters, 4=Flavor
  step: number;

  // Selections
  hydrantFlavor: HydrationItem | null;
  aloeFlavor: HydrationItem | null;
  smoothieType: SmoothieType | null;
  selectedBoosters: Booster[];
  flavor: FlavorWithCategory | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setHydrantFlavor: (item: HydrationItem | null) => void;
  setAloeFlavor: (item: HydrationItem | null) => void;
  setSmoothieType: (type: SmoothieType | null) => void;
  toggleBooster: (booster: Booster) => void;
  setFlavor: (flavor: FlavorWithCategory | null) => void;
  reset: () => void;

  // Computed
  totalCalories: () => number;
  totalProtein: () => number;
  totalPrice: () => number;
  canProceed: () => boolean;
  buildName: () => string;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  step: 1,
  hydrantFlavor: null,
  aloeFlavor: null,
  smoothieType: null,
  selectedBoosters: [],
  flavor: null,

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 4) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),

  setHydrantFlavor: (hydrantFlavor) => set({ hydrantFlavor }),
  setAloeFlavor: (aloeFlavor) => set({ aloeFlavor }),
  setSmoothieType: (smoothieType) => set({ smoothieType }),

  setFlavor: (flavor) => set({ flavor }),

  toggleBooster: (booster) =>
    set((s) => {
      const exists = s.selectedBoosters.some((b) => b.id === booster.id);
      return {
        selectedBoosters: exists
          ? s.selectedBoosters.filter((b) => b.id !== booster.id)
          : [...s.selectedBoosters, booster],
      };
    }),

  reset: () =>
    set({
      step: 1,
      hydrantFlavor: null,
      aloeFlavor: null,
      smoothieType: null,
      selectedBoosters: [],
      flavor: null,
    }),

  totalCalories: () => {
    const s = get();
    let cal = s.smoothieType?.calories ?? 0;
    if (s.hydrantFlavor) cal += s.hydrantFlavor.calories;
    if (s.aloeFlavor) cal += s.aloeFlavor.calories;
    s.selectedBoosters.forEach((b) => {
      if (b.grams) cal += b.grams * 4;
    });
    return cal;
  },

  totalProtein: () => {
    const s = get();
    let prot = s.smoothieType?.protein ?? 0;
    s.selectedBoosters.forEach((b) => {
      if (b.slug === "protein" && b.grams) prot += b.grams;
    });
    return prot;
  },

  totalPrice: () => {
    const s = get();
    let price = s.smoothieType?.base_price ?? 0;
    s.selectedBoosters.forEach((b) => {
      price += b.price;
    });
    if (s.hydrantFlavor) price += s.hydrantFlavor.price;
    if (s.aloeFlavor) price += s.aloeFlavor.price;
    return price;
  },

  canProceed: () => {
    const s = get();
    switch (s.step) {
      case 1:
        return true; // hydration is optional
      case 2:
        return s.smoothieType !== null;
      case 3:
        return true; // boosters are optional
      case 4:
        return s.flavor !== null;
      default:
        return false;
    }
  },

  buildName: () => {
    const s = get();
    const parts: string[] = [];
    if (s.smoothieType) parts.push(s.smoothieType.name);
    if (s.flavor) parts.push(s.flavor.name);
    return parts.join(" ") || "Custom Smoothie";
  },
}));
