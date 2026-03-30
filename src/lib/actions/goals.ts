"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { FITNESS_GOALS, type FitnessGoal } from "@/lib/constants";
import type { Profile, SmoothieType, Booster } from "@/types/database";

export async function setGoal(goal: FitnessGoal) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const targets = FITNESS_GOALS[goal];

  await supabase
    .from("profiles")
    .update({
      fitness_goal: goal,
      daily_calorie_target: targets.calories,
      daily_protein_target: targets.protein,
      daily_carb_target: targets.carbs,
      daily_fat_target: targets.fat,
    } as never)
    .eq("id", user.id);

  revalidatePath("/goals");
  revalidatePath("/profile");
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (data as unknown as Profile) ?? null;
}

// Recommend smoothie types and boosters based on fitness goal
export interface GoalRecommendation {
  type: SmoothieType;
  matchScore: number;
  recommendedBoosters: Booster[];
  reason: string;
}

export async function getRecommendations(): Promise<GoalRecommendation[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const profile = await getProfile();
  if (!profile?.fitness_goal) return [];

  const { data: types } = await supabase
    .from("smoothie_types")
    .select("*")
    .eq("available", true)
    .order("sort_order");

  const { data: boosters } = await supabase
    .from("boosters")
    .select("*")
    .eq("available", true)
    .order("sort_order");

  if (!types || !boosters) return [];

  const goal = profile.fitness_goal as FitnessGoal;
  const proteinTarget = profile.daily_protein_target ?? 140;
  const calTarget = profile.daily_calorie_target ?? 2200;

  // Score each type based on how well it fits the goal
  return (types as SmoothieType[])
    .map((type) => {
      // Protein match: how much of daily protein does one smoothie cover?
      const proteinRatio = type.protein / (proteinTarget * 0.25);
      const proteinScore = Math.min(proteinRatio, 1);

      // Calorie appropriateness: closer to 25% of daily target = better
      const idealCal = calTarget * 0.25;
      const calScore = 1 - Math.abs(type.calories - idealCal) / idealCal;

      const matchScore = Math.round(
        Math.max((proteinScore * 0.6 + Math.max(calScore, 0) * 0.4) * 100, 10)
      );

      // Recommend boosters per goal
      const boosterSlugs: Record<string, string[]> = {
        bulk: ["extra-protein", "creatine", "bcaas"],
        cut: ["bcaas", "extra-protein", "collagen"],
        maintain: ["collagen", "bcaas", "extra-protein"],
        energy: ["creatine", "bcaas", "extra-protein"],
      };

      const recommendedBoosters = (boosters as Booster[]).filter((b) =>
        (boosterSlugs[goal] ?? []).includes(b.slug)
      );

      const reasons: Record<string, string> = {
        bulk: `${type.protein}g protein helps build muscle mass`,
        cut: `${type.calories} cal keeps you in a caloric deficit`,
        maintain: `Balanced ${type.protein}g protein and ${type.calories} cal`,
        energy: `${type.calories} cal fuels your active lifestyle`,
      };

      return {
        type,
        matchScore,
        recommendedBoosters,
        reason: reasons[goal] ?? "",
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
