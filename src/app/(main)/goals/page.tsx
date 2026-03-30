import { getProfile } from "@/lib/actions/goals";
import { GoalsClient } from "./goals-client";

export const metadata = {
  title: "Fitness Goals",
};

export default async function GoalsPage() {
  const profile = await getProfile();

  return <GoalsClient currentGoal={profile?.fitness_goal ?? null} profile={profile} />;
}
