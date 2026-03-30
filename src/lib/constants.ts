export const FITNESS_GOALS = {
  bulk: {
    label: "Bulk",
    description: "Build muscle mass with high protein & calories",
    emoji: "💪",
    calories: 3000,
    protein: 180,
    carbs: 350,
    fat: 90,
  },
  cut: {
    label: "Cut",
    description: "Lean down while preserving muscle",
    emoji: "🔥",
    calories: 1800,
    protein: 160,
    carbs: 150,
    fat: 60,
  },
  maintain: {
    label: "Maintain",
    description: "Stay balanced with steady nutrition",
    emoji: "⚖️",
    calories: 2200,
    protein: 140,
    carbs: 250,
    fat: 75,
  },
  energy: {
    label: "Energy",
    description: "Maximize performance and endurance",
    emoji: "⚡",
    calories: 2500,
    protein: 100,
    carbs: 350,
    fat: 70,
  },
} as const;

export type FitnessGoal = keyof typeof FITNESS_GOALS;

export const SIZES = ["small", "medium", "large"] as const;
export type Size = (typeof SIZES)[number];

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "picked_up",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const LOYALTY_TIERS = {
  bronze: { min: 0, label: "Bronze", color: "text-amber-600" },
  silver: { min: 500, label: "Silver", color: "text-gray-400" },
  gold: { min: 2000, label: "Gold", color: "text-yellow-400" },
  platinum: { min: 5000, label: "Platinum", color: "text-primary" },
} as const;

export const POINTS_PER_DOLLAR = 1;
export const POINTS_REDEMPTION_RATE = 100; // 100 points = $1 off
