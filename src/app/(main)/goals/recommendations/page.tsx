import Link from "next/link";
import { getRecommendations, getProfile } from "@/lib/actions/goals";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Recommendations" };

export default async function RecommendationsPage() {
  const [recs, profile] = await Promise.all([
    getRecommendations(),
    getProfile(),
  ]);

  if (!profile?.fitness_goal) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Set a Goal First</h1>
        <p className="text-muted-foreground mt-2">
          We need to know your fitness goal to make recommendations.
        </p>
        <Link
          href="/goals"
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90"
        >
          Set Your Goal
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">
          Recommended for You
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Based on your <span className="text-primary font-medium capitalize">{profile.fitness_goal}</span> goal
        </p>
      </div>

      <div className="space-y-4">
        {recs.map((rec) => (
          <div
            key={rec.type.id}
            className="rounded-2xl border border-border bg-white p-5 space-y-3 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold">{rec.type.name}</h2>
              <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
                {rec.matchScore}% match
              </span>
            </div>

            <p className="text-sm text-muted-foreground">{rec.reason}</p>

            <div className="flex gap-4 text-sm">
              <span className="text-primary font-medium">{rec.type.protein}g protein</span>
              <span className="text-muted-foreground">{rec.type.calories} cal</span>
              <span className="font-semibold">{formatPrice(rec.type.base_price)}</span>
            </div>

            {rec.recommendedBoosters.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Recommended Boosters
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {rec.recommendedBoosters.map((b) => (
                    <span
                      key={b.id}
                      className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium"
                    >
                      {b.name}
                      {b.grams ? ` (+${b.grams}g)` : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/build"
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-95"
            >
              Build with {rec.type.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
