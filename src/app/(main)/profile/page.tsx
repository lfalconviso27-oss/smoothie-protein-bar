import { getProfile } from "@/lib/actions/goals";
import { getOrders } from "@/lib/actions/orders";
import { getSavedBuilds } from "@/lib/actions/menu";
import { signOut } from "@/lib/actions/auth";
import { formatPrice } from "@/lib/utils";
import { LOYALTY_TIERS } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Trophy, Zap, Shield, Crown, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Profile",
};

const TIER_CONFIG = {
  bronze: {
    icon: Shield,
    gradient: "from-amber-700 via-amber-600 to-amber-500",
    glow: "shadow-amber-500/30",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
    perks: ["Priority order processing", "Exclusive flavor previews"],
  },
  silver: {
    icon: Star,
    gradient: "from-slate-500 via-slate-400 to-slate-300",
    glow: "shadow-slate-400/30",
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-600",
    badge: "bg-slate-100 text-slate-600",
    perks: ["Priority order processing", "Exclusive flavor previews", "Free booster upgrade monthly"],
  },
  gold: {
    icon: Trophy,
    gradient: "from-yellow-600 via-yellow-500 to-yellow-300",
    glow: "shadow-yellow-400/30",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-700",
    perks: ["Priority order processing", "Exclusive flavor previews", "Free booster upgrade monthly", "10% off every order"],
  },
  platinum: {
    icon: Crown,
    gradient: "from-violet-700 via-primary to-violet-400",
    glow: "shadow-primary/30",
    bg: "bg-primary/5",
    border: "border-primary/30",
    text: "text-primary",
    badge: "bg-primary/10 text-primary",
    perks: ["Priority order processing", "Exclusive flavor previews", "Free booster upgrade monthly", "15% off every order", "VIP early access to new flavors"],
  },
} as const;

const TIER_ORDER = ["bronze", "silver", "gold", "platinum"] as const;

export default async function ProfilePage() {
  const [profile, orders, savedBuilds] = await Promise.all([
    getProfile(),
    getOrders().catch(() => []),
    getSavedBuilds(),
  ]);

  if (!profile) {
    return (
      <div className="px-4 py-12 text-center space-y-4">
        <h1 className="font-heading text-2xl font-bold">Not Signed In</h1>
        <p className="text-muted-foreground">
          Sign in to view your profile, saved builds, and orders.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const tierKey =
    (profile.loyalty_tier as keyof typeof LOYALTY_TIERS) ?? "bronze";
  const tier = LOYALTY_TIERS[tierKey] ?? LOYALTY_TIERS.bronze;
  const config = TIER_CONFIG[tierKey as keyof typeof TIER_CONFIG] ?? TIER_CONFIG.bronze;
  const TierIcon = config.icon;

  const currentTierIndex = TIER_ORDER.indexOf(tierKey as (typeof TIER_ORDER)[number]);
  const nextTierKey = TIER_ORDER[currentTierIndex + 1] as (typeof TIER_ORDER)[number] | undefined;
  const nextTier = nextTierKey ? LOYALTY_TIERS[nextTierKey] : null;
  const pointsInTier = profile.loyalty_points - tier.min;
  const pointsNeeded = nextTier ? nextTier.min - tier.min : 1;
  const progressPct = nextTier
    ? Math.min(100, Math.round((pointsInTier / pointsNeeded) * 100))
    : 100;
  const pointsToNext = nextTier ? nextTier.min - profile.loyalty_points : 0;

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
          {profile.full_name?.charAt(0) ?? profile.email.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="font-heading text-xl font-bold">
            {profile.full_name ?? "User"}
          </h1>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
        <form action={signOut}>
          <Button variant="ghost" size="sm" type="submit" className="rounded-2xl">
            Sign out
          </Button>
        </form>
      </div>

      {/* Loyalty Card */}
      <div className={`rounded-3xl overflow-hidden border ${config.border} shadow-lg ${config.glow}`}>
        {/* Top gradient strip */}
        <div className={`bg-gradient-to-r ${config.gradient} px-5 pt-5 pb-8 relative overflow-hidden`}>
          {/* Background decoration */}
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -right-2 top-8 h-16 w-16 rounded-full bg-white/10" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
                Loyalty Points
              </p>
              <p className="text-white font-heading text-4xl font-bold leading-none">
                {profile.loyalty_points.toLocaleString()}
              </p>
              <p className="text-white/70 text-xs mt-1">
                ≈ ${(profile.loyalty_points / 100).toFixed(2)} in rewards
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <TierIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-white font-bold text-sm">{tier.label}</span>
            </div>
          </div>
        </div>

        {/* Progress section */}
        <div className={`${config.bg} px-5 py-4 -mt-4 relative`}>
          <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
            {nextTier ? (
              <>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${config.text}`}>{tier.label}</span>
                  <span className="text-muted-foreground font-medium">
                    {pointsToNext} pts to {TIER_CONFIG[nextTierKey! as keyof typeof TIER_CONFIG]?.badge ? nextTierKey!.charAt(0).toUpperCase() + nextTierKey!.slice(1) : "next tier"}
                  </span>
                  <span className="font-bold text-foreground">
                    {LOYALTY_TIERS[nextTierKey!].label}
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {progressPct}% of the way to {LOYALTY_TIERS[nextTierKey!].label}
                </p>
              </>
            ) : (
              <div className="text-center py-1">
                <p className={`font-bold text-sm ${config.text}`}>
                  You&apos;ve reached the highest tier!
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enjoy all Platinum perks
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Perks */}
        <div className={`${config.bg} px-5 pb-5`}>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Your Perks
          </p>
          <div className="space-y-1.5">
            {config.perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-xs">
                <Zap className={`h-3 w-3 shrink-0 ${config.text}`} />
                <span className="text-foreground font-medium">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tier progression preview */}
      <div className="grid grid-cols-4 gap-2">
        {TIER_ORDER.map((t) => {
          const tc = TIER_CONFIG[t];
          const TIcon = tc.icon;
          const isActive = t === tierKey;
          const isPast =
            TIER_ORDER.indexOf(t) < TIER_ORDER.indexOf(tierKey as (typeof TIER_ORDER)[number]);
          return (
            <div
              key={t}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-2.5 transition-all ${
                isActive
                  ? `${tc.border} ${tc.bg}`
                  : isPast
                  ? "border-border bg-secondary/50 opacity-60"
                  : "border-dashed border-border bg-white opacity-40"
              }`}
            >
              <TIcon className={`h-4 w-4 ${isActive ? tc.text : "text-muted-foreground"}`} />
              <span className={`text-xs font-bold ${isActive ? tc.text : "text-muted-foreground"}`}>
                {LOYALTY_TIERS[t].label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {LOYALTY_TIERS[t].min === 0 ? "0 pts" : `${LOYALTY_TIERS[t].min.toLocaleString()}+`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Goal */}
      {profile.fitness_goal && (
        <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Current Goal</p>
              <p className="font-heading font-bold capitalize">
                {profile.fitness_goal}
              </p>
            </div>
            <Link
              href="/goals"
              className="text-xs text-primary hover:underline font-medium"
            >
              Change
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3 text-center text-xs">
            <div>
              <p className="font-bold">{profile.daily_calorie_target}</p>
              <p className="text-muted-foreground">Cal</p>
            </div>
            <div>
              <p className="font-bold text-primary">
                {profile.daily_protein_target}g
              </p>
              <p className="text-muted-foreground">Protein</p>
            </div>
            <div>
              <p className="font-bold">{profile.daily_carb_target}g</p>
              <p className="text-muted-foreground">Carbs</p>
            </div>
            <div>
              <p className="font-bold text-amber-500">
                {profile.daily_fat_target}g
              </p>
              <p className="text-muted-foreground">Fat</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold">Recent Orders</h2>
          <Link
            href="/profile/orders"
            className="flex items-center gap-0.5 text-xs text-primary hover:underline font-medium"
          >
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No orders yet
          </p>
        ) : (
          recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/order/${order.id}`}
              className="flex items-center justify-between p-3 bg-white rounded-2xl border border-border hover:border-primary/30 transition-all shadow-soft"
            >
              <div>
                <p className="font-mono text-sm font-medium">
                  {order.order_number}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {order.status.replace("_", " ")}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Saved Builds */}
      {savedBuilds.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-heading font-semibold">Saved Builds</h2>
          <div className="space-y-2">
            {savedBuilds.slice(0, 4).map((build) => (
              <Link
                key={build.id}
                href="/build"
                className="flex items-center justify-between p-3 bg-white rounded-2xl border border-border hover:border-primary/30 transition-all shadow-soft"
              >
                <div>
                  <p className="font-semibold text-sm">{build.name}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="text-primary">{build.total_protein}g protein</span>
                    <span>{build.total_calories} cal</span>
                  </div>
                </div>
                <p className="text-sm font-medium">{formatPrice(build.total_price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
