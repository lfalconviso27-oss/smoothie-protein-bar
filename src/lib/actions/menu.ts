"use server";

import {
  SMOOTHIE_TYPES,
  FLAVOR_CATEGORIES,
  FLAVORS,
  BOOSTERS,
  ENHANCERS,
  HYDRATION_ITEMS,
  SNACKS,
  DAILY_SPECIALS,
  getTodaySpecialStatic,
} from "@/lib/menu-data";
import type {
  SmoothieType,
  FlavorCategory,
  Flavor,
  Booster,
  Enhancer,
  HydrationItem,
  Snack,
  DailySpecial,
  SavedBuild,
} from "@/types/database";

export type FlavorWithCategory = (typeof FLAVORS)[0];

// ── Helpers ────────────────────────────────────────────────

async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

// ── Smoothie types ─────────────────────────────────────────

export async function getSmoothieTypes(): Promise<SmoothieType[]> {
  try {
    const supabase = await getSupabase();
    const { data } = await supabase
      .from("smoothie_types")
      .select("*")
      .eq("available", true)
      .order("sort_order");
    if (data && data.length > 0) return data as SmoothieType[];
  } catch {}
  return SMOOTHIE_TYPES;
}

export async function getFlavorCategories(): Promise<FlavorCategory[]> {
  try {
    const supabase = await getSupabase();
    const { data } = await supabase
      .from("flavor_categories")
      .select("*")
      .order("sort_order");
    if (data && data.length > 0) return data as FlavorCategory[];
  } catch {}
  return FLAVOR_CATEGORIES;
}

export async function getFlavors(): Promise<FlavorWithCategory[]> {
  try {
    const supabase = await getSupabase();
    const { data } = await supabase
      .from("flavors")
      .select("*, category:flavor_categories(*)")
      .eq("available", true)
      .order("sort_order");
    if (data && data.length > 0) return data as FlavorWithCategory[];
  } catch {}
  return FLAVORS;
}

export async function getBoosters(): Promise<Booster[]> {
  try {
    const supabase = await getSupabase();
    const { data } = await supabase
      .from("boosters")
      .select("*")
      .eq("available", true)
      .order("sort_order");
    if (data && data.length > 0) return data as Booster[];
  } catch {}
  return BOOSTERS;
}

// ── Hydration ──────────────────────────────────────────────

export async function getHydrationItems(): Promise<HydrationItem[]> {
  try {
    const supabase = await getSupabase();
    const { data } = await supabase
      .from("hydration_items")
      .select("*")
      .eq("available", true)
      .order("sort_order");
    if (data && data.length > 0) return data as HydrationItem[];
  } catch {}
  return HYDRATION_ITEMS;
}

// ── Enhancers ──────────────────────────────────────────────

export async function getEnhancers(): Promise<Enhancer[]> {
  try {
    const supabase = await getSupabase();
    const { data } = await supabase
      .from("enhancers")
      .select("*")
      .eq("available", true)
      .order("sort_order");
    if (data && data.length > 0) return data as Enhancer[];
  } catch {}
  return ENHANCERS;
}

// ── Snacks ─────────────────────────────────────────────────

export async function getSnacks(): Promise<Snack[]> {
  try {
    const supabase = await getSupabase();
    const { data } = await supabase
      .from("snacks")
      .select("*")
      .eq("available", true)
      .order("sort_order");
    if (data && data.length > 0) return data as Snack[];
  } catch {}
  return SNACKS;
}

// ── Bowls ──────────────────────────────────────────────────

export async function getBowls(): Promise<any[]> {
  try {
    const supabase = await getSupabase();
    const { data } = await supabase
      .from("bowls")
      .select("*")
      .eq("available", true)
      .order("sort_order");
    return (data ?? []) as any[];
  } catch {}
  return [];
}

// ── Daily Specials ─────────────────────────────────────────

export async function getDailySpecials(): Promise<DailySpecial[]> {
  try {
    const supabase = await getSupabase();
    const { data } = await supabase
      .from("daily_specials")
      .select("*")
      .order("day_of_week");
    if (data && data.length > 0) return data as DailySpecial[];
  } catch {}
  return DAILY_SPECIALS;
}

export async function getTodaySpecial(): Promise<DailySpecial | null> {
  try {
    const dayOfWeek = new Date().getDay();
    const dbDay = dayOfWeek === 0 ? 7 : dayOfWeek;
    const supabase = await getSupabase();
    const { data } = await supabase
      .from("daily_specials")
      .select("*")
      .eq("day_of_week", dbDay)
      .limit(1);
    const row = (data as DailySpecial[] | null)?.[0];
    return row ?? getTodaySpecialStatic();
  } catch {}
  return getTodaySpecialStatic();
}

// ── Aggregate for menu page ────────────────────────────────

export interface MenuData {
  smoothieTypes: SmoothieType[];
  flavorCategories: FlavorCategory[];
  flavors: FlavorWithCategory[];
  boosters: Booster[];
  enhancers: Enhancer[];
  hydrationItems: HydrationItem[];
  snacks: Snack[];
  bowls: any[];
  dailySpecials: DailySpecial[];
  todaySpecial: DailySpecial | null;
}

export async function getMenuData(): Promise<MenuData> {
  const [
    smoothieTypes,
    flavorCategories,
    flavors,
    boosters,
    enhancers,
    hydrationItems,
    snacks,
    bowls,
    dailySpecials,
    todaySpecial,
  ] = await Promise.all([
    getSmoothieTypes(),
    getFlavorCategories(),
    getFlavors(),
    getBoosters(),
    getEnhancers(),
    getHydrationItems(),
    getSnacks(),
    getBowls(),
    getDailySpecials(),
    getTodaySpecial(),
  ]);

  return {
    smoothieTypes,
    flavorCategories,
    flavors,
    boosters,
    enhancers,
    hydrationItems,
    snacks,
    bowls,
    dailySpecials,
    todaySpecial,
  };
}

// ── Builder data ───────────────────────────────────────────

export interface BuilderData {
  smoothieTypes: SmoothieType[];
  flavorCategories: FlavorCategory[];
  flavors: FlavorWithCategory[];
  boosters: Booster[];
  hydrationItems: HydrationItem[];
}

export async function getBuilderData(): Promise<BuilderData> {
  const [smoothieTypes, flavorCategories, flavors, boosters, hydrationItems] =
    await Promise.all([
      getSmoothieTypes(),
      getFlavorCategories(),
      getFlavors(),
      getBoosters(),
      getHydrationItems(),
    ]);

  return { smoothieTypes, flavorCategories, flavors, boosters, hydrationItems };
}

// ── Saved Builds ───────────────────────────────────────────

export async function getSavedBuilds(): Promise<SavedBuild[]> {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from("saved_builds")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    return (data ?? []) as SavedBuild[];
  } catch {}
  return [];
}

export async function saveBuild(build: {
  name: string;
  smoothieTypeId: string;
  flavorId: string;
  boosterIds: string[];
  hydrationId?: string;
  totalProtein: number;
  totalCalories: number;
  totalPrice: number;
}): Promise<void> {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase.from("saved_builds").insert({
    user_id: user.id,
    name: build.name,
    smoothie_type_id: build.smoothieTypeId,
    flavor_id: build.flavorId,
    booster_ids: build.boosterIds,
    hydration_id: build.hydrationId ?? null,
    total_protein: build.totalProtein,
    total_calories: build.totalCalories,
    total_price: build.totalPrice,
  } as never);
}

export async function deleteSavedBuild(id: string): Promise<void> {
  const supabase = await getSupabase();
  await supabase.from("saved_builds").delete().eq("id", id);
}
