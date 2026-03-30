import { getProfile } from "@/lib/actions/goals";
import { getOrders } from "@/lib/actions/orders";
import { getSavedBuilds } from "@/lib/actions/menu";
import { signOut } from "@/lib/actions/auth";
import { formatPrice } from "@/lib/utils";
import { LOYALTY_TIERS } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Profile",
};

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
        <p className="text-muted-foreground">Sign in to view your profile, saved builds, and orders.</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const tier =
    LOYALTY_TIERS[profile.loyalty_tier as keyof typeof LOYALTY_TIERS] ??
    LOYALTY_TIERS.bronze;
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

      {/* Loyalty */}
      <div className="rounded-2xl border border-border bg-white p-4 flex items-center justify-between shadow-soft">
        <div>
          <p className="text-sm text-muted-foreground">Loyalty Points</p>
          <p className="text-2xl font-bold">{profile.loyalty_points}</p>
        </div>
        <span className={`font-heading font-bold text-lg capitalize ${tier.color}`}>
          {tier.label}
        </span>
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
            <Link href="/goals" className="text-xs text-primary hover:underline font-medium">
              Change
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3 text-center text-xs">
            <div>
              <p className="font-bold">{profile.daily_calorie_target}</p>
              <p className="text-muted-foreground">Cal</p>
            </div>
            <div>
              <p className="font-bold text-primary">{profile.daily_protein_target}g</p>
              <p className="text-muted-foreground">Protein</p>
            </div>
            <div>
              <p className="font-bold text-purple">{profile.daily_carb_target}g</p>
              <p className="text-muted-foreground">Carbs</p>
            </div>
            <div>
              <p className="font-bold text-amber-500">{profile.daily_fat_target}g</p>
              <p className="text-muted-foreground">Fat</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold">Recent Orders</h2>
          <Link href="/profile/orders" className="text-xs text-primary hover:underline font-medium">
            View all
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
