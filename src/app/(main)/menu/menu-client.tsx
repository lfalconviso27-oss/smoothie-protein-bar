"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Cookie,
  Sparkles,
  Plus,
  Star,
  Coffee,
  Search,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";
import { fadeUp, staggerContainer } from "@/components/shared/motion";
import type { MenuData } from "@/lib/actions/menu";
import type { CartItem } from "@/types/cart";

type AddItemFn = (item: Omit<CartItem, "id">) => void;
type Tab = "smoothies" | "snacks" | "specials" | "enhancers";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "smoothies", label: "Smoothies", icon: <Zap className="h-4 w-4" /> },
  { key: "snacks", label: "Snacks", icon: <Cookie className="h-4 w-4" /> },
  { key: "specials", label: "Specials", icon: <Star className="h-4 w-4" /> },
  { key: "enhancers", label: "Enhancers", icon: <Sparkles className="h-4 w-4" /> },
];

const SNACK_ICONS: Record<string, string> = {
  brownies: "🍫",
  muffins: "🧁",
  "iced-coffee": "☕",
  "chocolate-protein-bar": "🍫",
  "waffles-pancakes": "🧇",
  "protein-bar-24g": "💪",
  "express-meal-bar": "🥙",
  donuts: "🍩",
};

const SPECIAL_ICONS: Record<string, string> = {
  Monday: "🥗",
  Tuesday: "🍫",
  Wednesday: "🍩",
  Thursday: "🧁",
  Friday: "🧇",
  Saturday: "⭐",
  Sunday: "🌟",
};

const ENHANCER_ICONS: Record<string, string> = {
  "beta-power": "⚡",
  "super-power": "💪",
  "tequila-sunrise": "🌅",
  "beauty-booster": "✨",
};

const TYPE_ICONS: Record<string, string> = {
  basic: "💧",
  fit: "💪",
  power: "⚡",
  vegan: "🌱",
};

const FLAVOR_CATEGORY_ICONS: Record<string, string> = {
  vanilla: "🍦",
  fruity: "🍓",
  coffee: "☕",
  chocolate: "🍫",
};

export function MenuClient({ data }: { data: MenuData }) {
  const [activeTab, setActiveTab] = useState<Tab>("smoothies");
  const [search, setSearch] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="px-4 py-6 space-y-5 pb-28 max-w-3xl mx-auto">
      {/* Daily special banner */}
      {data.todaySpecial && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-4 flex items-center gap-3 shadow-soft"
        >
          <span className="text-2xl">{SPECIAL_ICONS[data.todaySpecial.day_name] ?? "✨"}</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">
              {data.todaySpecial.day_name} Special
            </p>
            <p className="font-heading font-bold text-lg">{data.todaySpecial.item_name}</p>
            {data.todaySpecial.description && (
              <p className="text-xs text-muted-foreground">{data.todaySpecial.description}</p>
            )}
          </div>
          <Link
            href="/build"
            className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors"
          >
            Order
          </Link>
        </motion.div>
      )}

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-soft"
        />
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all",
              activeTab === tab.key
                ? "bg-primary text-white shadow-soft"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "smoothies" && <SmoothiesSection data={data} search={search} />}
          {activeTab === "snacks" && <SnacksSection data={data} addItem={addItem} search={search} />}
          {activeTab === "specials" && <SpecialsSection data={data} addItem={addItem} />}
          {activeTab === "enhancers" && <EnhancersSection data={data} addItem={addItem} search={search} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Smoothies ──────────────────────────────────────────────

function SmoothiesSection({ data, search }: { data: MenuData; search: string }) {
  const [activeCat, setActiveCat] = useState(data.flavorCategories[0]?.slug ?? "vanilla");

  const filteredFlavors = data.flavors.filter(
    (f) =>
      f.category.slug === activeCat &&
      (!search || f.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Build CTA */}
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
        <Link
          href="/build"
          className="block rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 transition-all hover:shadow-soft-lg active:scale-[0.98] shadow-soft"
        >
          <p className="text-3xl mb-2">🥤</p>
          <h2 className="font-heading text-xl font-bold">Build Your Smoothie</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Step-by-step builder — choose your base, flavor, and boosters.
          </p>
          {/* Type pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {data.smoothieTypes.map((t) => (
              <span
                key={t.slug}
                className="flex items-center gap-1 rounded-full bg-white border border-border px-3 py-1 text-xs font-semibold shadow-soft"
              >
                <span>{TYPE_ICONS[t.slug] ?? "🥤"}</span>
                {t.name} · {t.protein}g
              </span>
            ))}
          </div>
          <p className="text-xs text-primary font-semibold mt-3">
            {data.flavors.length} flavors across {data.flavorCategories.length} categories →
          </p>
        </Link>
      </motion.div>

      {/* Smoothie type cards */}
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
        <h3 className="font-heading font-bold text-lg mb-3">Smoothie Types</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.smoothieTypes.map((type) => (
            <Link
              key={type.id}
              href="/build"
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-white p-4 text-center shadow-soft hover:border-primary/30 hover:shadow-soft-lg transition-all active:scale-[0.97]"
            >
              <span className="text-2xl">{TYPE_ICONS[type.slug] ?? "🥤"}</span>
              <span className="font-heading font-bold">{type.name}</span>
              <span className="text-xs text-primary font-semibold">{type.protein}g protein</span>
              <span className="text-xs text-muted-foreground">{type.calories} cal</span>
              <span className="text-xs font-bold text-foreground">{formatPrice(type.base_price)}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Flavor category tabs */}
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
        <h3 className="font-heading font-bold text-lg mb-3">Browse Flavors</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-4">
          {data.flavorCategories.map((cat) => {
            const count = data.flavors.filter((f) => f.category.slug === cat.slug).length;
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveCat(cat.slug)}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  activeCat === cat.slug
                    ? "bg-primary text-white shadow-soft"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{cat.icon ?? FLAVOR_CATEGORY_ICONS[cat.slug]}</span>
                {cat.name}
                <span className={cn("text-xs", activeCat === cat.slug ? "text-white/70" : "text-muted-foreground")}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat + search}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
          >
            {filteredFlavors.length > 0 ? (
              filteredFlavors.map((flavor) => (
                <Link
                  key={flavor.id}
                  href="/build"
                  className="rounded-2xl border border-border bg-white px-4 py-3 text-sm font-medium hover:border-primary/30 hover:shadow-soft hover:bg-primary/5 transition-all shadow-soft text-center"
                >
                  {flavor.name}
                </Link>
              ))
            ) : (
              <p className="col-span-full text-sm text-muted-foreground text-center py-4">
                No flavors match &ldquo;{search}&rdquo;
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Boosters preview */}
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
        <h3 className="font-heading font-bold text-lg mb-3">Boosters</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {data.boosters.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-border bg-white p-3 text-center shadow-soft"
            >
              <p className="text-sm font-semibold">{b.name}</p>
              <p className="text-xs text-primary font-medium mt-0.5">+{formatPrice(b.price)}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hydration preview */}
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
        <h3 className="font-heading font-bold text-lg mb-3">Hydrant + Aloe</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
            <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">💧 Hydrant</p>
            <div className="space-y-1">
              {data.hydrationItems
                .filter((h) => h.hydration_type === "hydrant")
                .map((h) => (
                  <p key={h.id} className="text-sm font-medium">{h.name}</p>
                ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
            <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-2">🌿 Aloe</p>
            <div className="space-y-1">
              {data.hydrationItems
                .filter((h) => h.hydration_type === "aloe")
                .map((h) => (
                  <p key={h.id} className="text-sm font-medium">{h.name}</p>
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Snacks ─────────────────────────────────────────────────

function SnacksSection({
  data,
  addItem,
  search,
}: {
  data: MenuData;
  addItem: AddItemFn;
  search: string;
}) {
  const filtered = data.snacks.filter(
    (s) => !search || s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
        <h2 className="font-heading text-xl font-bold">Healthy Snacks</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Protein-packed snacks to complement your smoothie.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map((snack) => (
            <motion.div
              key={snack.id}
              variants={fadeUp}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border bg-white p-4 flex flex-col shadow-soft hover:shadow-soft-lg transition-all hover:border-primary/20"
            >
              <div className="text-3xl mb-2 text-center">
                {SNACK_ICONS[snack.slug] ?? "🍎"}
              </div>
              <h3 className="font-semibold text-sm text-center leading-snug">{snack.name}</h3>
              <div className="flex items-center justify-center gap-2 mt-1.5 text-xs">
                {snack.protein > 0 && (
                  <span className="text-primary font-semibold">{snack.protein}g protein</span>
                )}
                <span className="text-muted-foreground">{snack.calories} cal</span>
              </div>
              <div className="flex items-center justify-between mt-auto pt-3">
                <span className="text-sm font-bold">{formatPrice(snack.price)}</span>
                <button
                  onClick={() => {
                    addItem({
                      productType: "snack",
                      name: snack.name,
                      quantity: 1,
                      unitPrice: snack.price,
                      details: { itemId: snack.id },
                      nutrition: { calories: snack.calories, protein: snack.protein },
                    });
                    toast.success(`${snack.name} added to cart`);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-primary/90 active:scale-95 shadow-soft"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-sm text-muted-foreground text-center py-8">
            No snacks match &ldquo;{search}&rdquo;
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── Specials ───────────────────────────────────────────────

function SpecialsSection({
  data,
  addItem,
}: {
  data: MenuData;
  addItem: AddItemFn;
}) {
  const dayOfWeek = new Date().getDay();
  const todayDbDay = dayOfWeek === 0 ? 7 : dayOfWeek;

  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
        <h2 className="font-heading text-xl font-bold">Daily Specials</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fresh deals every day of the week.
        </p>
      </motion.div>

      <div className="space-y-3">
        {data.dailySpecials.map((special) => {
          const isToday = special.day_of_week === todayDbDay;
          return (
            <motion.div
              key={special.id}
              variants={fadeUp}
              transition={{ duration: 0.3 }}
              className={cn(
                "rounded-2xl border p-5 flex items-center gap-4 transition-all shadow-soft",
                isToday
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-white hover:border-primary/20 hover:shadow-soft-lg"
              )}
            >
              <span className="text-3xl">{SPECIAL_ICONS[special.day_name] ?? "✨"}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-heading font-bold text-lg">{special.item_name}</p>
                  {isToday && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                      Today
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium">{special.day_name}</p>
                {special.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{special.description}</p>
                )}
              </div>
              {isToday && (
                <Link
                  href="/menu"
                  className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-colors"
                >
                  Order
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Weekly calendar view */}
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
        <h3 className="font-heading font-bold text-base mb-3 mt-2">This Week</h3>
        <div className="grid grid-cols-5 gap-2">
          {data.dailySpecials.filter((s) => s.day_of_week <= 5).map((special) => {
            const isToday = special.day_of_week === todayDbDay;
            return (
              <div
                key={special.id}
                className={cn(
                  "rounded-2xl border p-3 text-center transition-all",
                  isToday
                    ? "border-primary bg-primary/10"
                    : "border-border bg-white"
                )}
              >
                <p className={cn("text-xs font-bold", isToday ? "text-primary" : "text-muted-foreground")}>
                  {special.day_name.slice(0, 3).toUpperCase()}
                </p>
                <p className="text-lg mt-1">{SPECIAL_ICONS[special.day_name] ?? "✨"}</p>
                <p className="text-[10px] font-semibold mt-1 leading-tight">{special.item_name}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Enhancers ──────────────────────────────────────────────

function EnhancersSection({
  data,
  addItem,
  search,
}: {
  data: MenuData;
  addItem: AddItemFn;
  search: string;
}) {
  const filtered = data.enhancers.filter(
    (e) => !search || e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
        <h2 className="font-heading text-xl font-bold">Enhancers</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Pre-built booster bundles for specific performance goals.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.length > 0 ? (
          filtered.map((enh) => (
            <motion.div
              key={enh.id}
              variants={fadeUp}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border bg-white p-5 shadow-soft hover:shadow-soft-lg hover:border-primary/20 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{ENHANCER_ICONS[enh.slug] ?? "⚡"}</span>
                    <h3 className="font-heading font-bold text-lg">{enh.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {enh.benefits.map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                  <p className="text-base font-bold mt-3">{formatPrice(enh.price)}</p>
                </div>
                <button
                  onClick={() => {
                    addItem({
                      productType: "enhancer",
                      name: enh.name,
                      quantity: 1,
                      unitPrice: enh.price,
                      details: { itemId: enh.id },
                      nutrition: { calories: 0, protein: 0 },
                    });
                    toast.success(`${enh.name} added to cart`);
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-primary/90 active:scale-95 shadow-soft"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-sm text-muted-foreground text-center py-8">
            No enhancers match &ldquo;{search}&rdquo;
          </p>
        )}
      </div>
    </motion.div>
  );
}
