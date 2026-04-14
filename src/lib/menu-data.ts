import type {
  SmoothieType,
  FlavorCategory,
  Flavor,
  Booster,
  Enhancer,
  HydrationItem,
  Snack,
  DailySpecial,
} from "@/types/database";

// ── Smoothie Types ──────────────────────────────────────────

export const SMOOTHIE_TYPES: SmoothieType[] = [
  {
    id: "basic",
    name: "Basic",
    slug: "basic",
    description: "Classic protein smoothie — great daily fuel",
    protein: 24,
    calories: 200,
    base_price: 899,
    available: true,
    sort_order: 1,
    created_at: "",
  },
  {
    id: "fit",
    name: "Fit",
    slug: "fit",
    description: "Higher protein for active lifestyles",
    protein: 32,
    calories: 250,
    base_price: 1099,
    available: true,
    sort_order: 2,
    created_at: "",
  },
  {
    id: "power",
    name: "Power",
    slug: "power",
    description: "Maximum protein for serious athletes",
    protein: 36,
    calories: 290,
    base_price: 1299,
    available: true,
    sort_order: 3,
    created_at: "",
  },
  {
    id: "vegan",
    name: "Vegan",
    slug: "vegan",
    description: "Pea + quinoa plant-based protein blend",
    protein: 25,
    calories: 250,
    base_price: 1199,
    available: true,
    sort_order: 4,
    created_at: "",
  },
];

// ── Flavor Categories ───────────────────────────────────────

export const FLAVOR_CATEGORIES: FlavorCategory[] = [
  {
    id: "vanilla",
    name: "Vanilla",
    slug: "vanilla",
    color: "#F5E6C8",
    icon: "🍦",
    sort_order: 1,
  },
  {
    id: "fruity",
    name: "Fruity",
    slug: "fruity",
    color: "#FFD6D6",
    icon: "🍓",
    sort_order: 2,
  },
  {
    id: "coffee",
    name: "Coffee",
    slug: "coffee",
    color: "#D4A878",
    icon: "☕",
    sort_order: 3,
  },
  {
    id: "chocolate",
    name: "Chocolate",
    slug: "chocolate",
    color: "#C4895A",
    icon: "🍫",
    sort_order: 4,
  },
];

// ── Flavors ─────────────────────────────────────────────────

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function makeFlavors(
  names: string[],
  categoryId: string,
  startOrder = 1
): (Flavor & { category: FlavorCategory })[] {
  const cat = FLAVOR_CATEGORIES.find((c) => c.id === categoryId)!;
  return names.map((name, i) => ({
    id: `${categoryId}-${toSlug(name)}`,
    name,
    slug: toSlug(name),
    category_id: categoryId,
    available: true,
    sort_order: startOrder + i,
    created_at: "",
    category: cat,
  }));
}

export const FLAVORS = [
  ...makeFlavors(
    [
      "AlfaJor",
      "Cinnamon Crunch",
      "Caramel Crunch",
      "Cookie Monster",
      "French Toast Tiger",
      "Ginger Detox",
      "Green Power",
      "Mint Mojito",
      "Oatmeal Cookie",
      "Peanut Lover",
      "Pecan Lover",
      "Pistachio",
      "Power Shield",
      "Snicker",
      "Summer Breeze",
      "Sussy",
    ],
    "vanilla"
  ),
  ...makeFlavors(
    [
      "Banana Caramel",
      "Banana Muffin",
      "Banana Pecan",
      "Banana Peanut",
      "Banana Split",
      "Banana Strawberry",
      "Batibat",
      "Beach Party",
      "Blueberry Cheesecake",
      "Cocada",
      "Crema Real",
      "Fruit Punch",
      "Guava Cheese",
      "Limoncello",
      "Mad Mango",
      "Orange Banana",
      "Orange Cheesecake",
      "Orange Chocolate",
      "Orange Pineapple",
      "Passion Fruit",
      "Piña Colada",
      "Pineapple Mango",
      "Strawberry Cheesecake",
      "Tropical",
      "Very Berry Cheesecake",
      "Waffle",
    ],
    "fruity"
  ),
  ...makeFlavors(
    [
      "Baileys",
      "Black Russian",
      "Coffee Lover",
      "Crema de Cafe",
      "French Vanilla",
      "Capuccino",
      "Macchiato",
      "Tiramisu",
    ],
    "coffee"
  ),
  ...makeFlavors(
    [
      "Almond Joy Monkey",
      "Brownie",
      "Choco Coco",
      "Choco Mint",
      "Choco Passion",
      "Nutella",
      "Nutella 2.0",
      "Toddy",
    ],
    "chocolate"
  ),
];

// ── Boosters ────────────────────────────────────────────────

export const BOOSTERS: Booster[] = [
  {
    id: "energy",
    name: "Energy",
    slug: "energy",
    grams: null,
    price: 100,
    available: true,
    sort_order: 1,
  },
  {
    id: "collagen",
    name: "Collagen",
    slug: "collagen",
    grams: null,
    price: 150,
    available: true,
    sort_order: 2,
  },
  {
    id: "guarana",
    name: "Guarana",
    slug: "guarana",
    grams: null,
    price: 100,
    available: true,
    sort_order: 3,
  },
  {
    id: "probiotic",
    name: "Probiotic",
    slug: "probiotic",
    grams: null,
    price: 150,
    available: true,
    sort_order: 4,
  },
  {
    id: "fiber",
    name: "Fiber",
    slug: "fiber",
    grams: null,
    price: 100,
    available: true,
    sort_order: 5,
  },
  {
    id: "protein",
    name: "Protein",
    slug: "protein",
    grams: 10,
    price: 150,
    available: true,
    sort_order: 6,
  },
  {
    id: "healthy-heart",
    name: "Healthy Heart",
    slug: "healthy-heart",
    grams: null,
    price: 150,
    available: true,
    sort_order: 7,
  },
  {
    id: "immune-system",
    name: "Immune System",
    slug: "immune-system",
    grams: null,
    price: 150,
    available: true,
    sort_order: 8,
  },
  {
    id: "creatine",
    name: "Creatine",
    slug: "creatine",
    grams: 5,
    price: 150,
    available: true,
    sort_order: 9,
  },
];

// ── Enhancers ────────────────────────────────────────────────

export const ENHANCERS: Enhancer[] = [
  {
    id: "beta-power",
    name: "Beta Power",
    slug: "beta-power",
    benefits: ["Pre-workout", "Energy boost", "Endurance"],
    price: 599,
    available: true,
    sort_order: 1,
  },
  {
    id: "super-power",
    name: "Super Power",
    slug: "super-power",
    benefits: ["Max strength", "Recovery", "Focus"],
    price: 699,
    available: true,
    sort_order: 2,
  },
  {
    id: "tequila-sunrise",
    name: "Tequila Sunrise",
    slug: "tequila-sunrise",
    benefits: ["Antioxidants", "Vitamin C", "Immunity"],
    price: 549,
    available: true,
    sort_order: 3,
  },
  {
    id: "beauty-booster",
    name: "Beauty Booster",
    slug: "beauty-booster",
    benefits: ["Skin glow", "Hair & nails", "Collagen"],
    price: 499,
    available: true,
    sort_order: 4,
  },
];

// ── Hydration Items ─────────────────────────────────────────

export const HYDRATION_ITEMS: HydrationItem[] = [
  // Hydrant flavors
  {
    id: "hydrant-raspberry",
    name: "Raspberry",
    slug: "hydrant-raspberry",
    hydration_type: "hydrant",
    calories: 15,
    sugar: 3,
    price: 0,
    available: true,
    sort_order: 1,
  },
  {
    id: "hydrant-peach",
    name: "Peach",
    slug: "hydrant-peach",
    hydration_type: "hydrant",
    calories: 15,
    sugar: 3,
    price: 0,
    available: true,
    sort_order: 2,
  },
  {
    id: "hydrant-lemon",
    name: "Lemon",
    slug: "hydrant-lemon",
    hydration_type: "hydrant",
    calories: 10,
    sugar: 2,
    price: 0,
    available: true,
    sort_order: 3,
  },
  // Aloe flavors
  {
    id: "aloe-cranberry",
    name: "Cranberry",
    slug: "aloe-cranberry",
    hydration_type: "aloe",
    calories: 20,
    sugar: 4,
    price: 0,
    available: true,
    sort_order: 4,
  },
  {
    id: "aloe-mango",
    name: "Mango",
    slug: "aloe-mango",
    hydration_type: "aloe",
    calories: 20,
    sugar: 4,
    price: 0,
    available: true,
    sort_order: 5,
  },
];

// ── Snacks ──────────────────────────────────────────────────

export const SNACKS: Snack[] = [
  {
    id: "brownies",
    name: "Brownies",
    slug: "brownies",
    protein: 10,
    calories: 100,
    price: 299,
    available: true,
    sort_order: 1,
  },
  {
    id: "muffins",
    name: "Muffins",
    slug: "muffins",
    protein: 10,
    calories: 100,
    price: 299,
    available: true,
    sort_order: 2,
  },
  {
    id: "iced-coffee",
    name: "Iced Coffee",
    slug: "iced-coffee",
    protein: 15,
    calories: 100,
    price: 399,
    available: true,
    sort_order: 3,
  },
  {
    id: "chocolate-protein-bar",
    name: "Chocolate Protein Bar",
    slug: "chocolate-protein-bar",
    protein: 10,
    calories: 140,
    price: 349,
    available: true,
    sort_order: 4,
  },
  {
    id: "waffles-pancakes",
    name: "Waffles / Pancakes",
    slug: "waffles-pancakes",
    protein: 0,
    calories: 40,
    price: 249,
    available: true,
    sort_order: 5,
  },
  {
    id: "protein-bar-24g",
    name: "24g Protein Bar",
    slug: "protein-bar-24g",
    protein: 24,
    calories: 230,
    price: 399,
    available: true,
    sort_order: 6,
  },
  {
    id: "express-meal-bar",
    name: "Express Meal Bar",
    slug: "express-meal-bar",
    protein: 15,
    calories: 200,
    price: 349,
    available: true,
    sort_order: 7,
  },
  {
    id: "donuts",
    name: "Donuts",
    slug: "donuts",
    protein: 0,
    calories: 40,
    price: 199,
    available: true,
    sort_order: 8,
  },
];

// ── Daily Specials ──────────────────────────────────────────

export const DAILY_SPECIALS: DailySpecial[] = [
  {
    id: "1",
    day_of_week: 1,
    day_name: "Monday",
    item_name: "Bowls",
    description: "Fresh acai and protein bowls — today only!",
  },
  {
    id: "2",
    day_of_week: 2,
    day_name: "Tuesday",
    item_name: "Brownies",
    description: "Protein-packed brownies — 10g protein each.",
  },
  {
    id: "3",
    day_of_week: 3,
    day_name: "Wednesday",
    item_name: "Donuts",
    description: "Guilt-free protein donuts. Treat yourself.",
  },
  {
    id: "4",
    day_of_week: 4,
    day_name: "Thursday",
    item_name: "Muffins",
    description: "Freshly baked protein muffins.",
  },
  {
    id: "5",
    day_of_week: 5,
    day_name: "Friday",
    item_name: "Waffles",
    description: "End the week with protein waffles!",
  },
];

// ── Derived helpers ─────────────────────────────────────────

export function getTodaySpecialStatic(): DailySpecial | null {
  const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon...
  const dbDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  return DAILY_SPECIALS.find((d) => d.day_of_week === dbDay) ?? null;
}
