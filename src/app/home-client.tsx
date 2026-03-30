"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Zap, Star, Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { useUser } from "@/lib/hooks/use-user";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer } from "@/components/shared/motion";
import type { DailySpecial, SmoothieType } from "@/types/database";

const FEATURES = [
  {
    icon: "🥤",
    title: "Custom Builds",
    desc: "Choose your type, flavor, and boosters — built exactly how you want it.",
    color: "from-purple-50 to-purple-100",
  },
  {
    icon: "💪",
    title: "Up to 36g Protein",
    desc: "Fuel your goals with Basic, Fit, Power, or Vegan options.",
    color: "from-blue-50 to-blue-100",
  },
  {
    icon: "🌿",
    title: "Fresh & Natural",
    desc: "Real ingredients, 58+ unique flavors, and plant-based options.",
    color: "from-green-50 to-green-100",
  },
  {
    icon: "⚡",
    title: "Boosters & Enhancers",
    desc: "Energy, Collagen, Probiotics, and more — mix and match freely.",
    color: "from-yellow-50 to-yellow-100",
  },
];

const TYPE_ICONS: Record<string, string> = {
  basic: "💧",
  fit: "💪",
  power: "⚡",
  vegan: "🌱",
};

export function HomeContent({
  todaySpecial,
  smoothieTypes,
}: {
  todaySpecial: DailySpecial | null;
  smoothieTypes: SmoothieType[];
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const { user } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Landing Nav ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="font-heading text-lg font-bold tracking-tight">
            <span className="text-primary">Smoothie</span>
            <span className="text-foreground"> Protein Bar</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/menu", label: "Menu" },
              { href: "/build", label: "Order" },
              { href: "/#about", label: "About" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-2xl hover:bg-secondary transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {user ? (
              <Link
                href="/profile"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold"
              >
                {user.email?.charAt(0).toUpperCase()}
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex text-sm font-medium text-primary hover:text-primary/80 transition-colors px-3 py-2"
              >
                Sign in
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-2xl hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-white px-4 pb-4 overflow-hidden"
            >
              <nav className="flex flex-col gap-1 pt-2">
                {[
                  { href: "/menu", label: "Menu" },
                  { href: "/build", label: "Order" },
                  { href: "/#about", label: "About" },
                  { href: "/login", label: "Sign in" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pb-20 md:pb-0">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
          {/* Gradient background blobs */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/4 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute right-1/4 bottom-1/3 h-[300px] w-[300px] rounded-full bg-purple-300/20 blur-[80px]" />
            <div className="absolute left-1/4 bottom-1/4 h-[200px] w-[200px] rounded-full bg-blue-300/10 blur-[60px]" />
          </div>

          <motion.div
            className="space-y-6 max-w-lg"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <Star className="h-3 w-3 fill-primary" />
                58+ Unique Flavors
              </span>
            </motion.div>

            <motion.h1
              className="font-heading text-5xl sm:text-6xl font-bold tracking-tight leading-tight text-foreground"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              SMOOTHIE
              <br />
              <span className="text-primary relative">
                PROTEIN BAR
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 6C50 2 100 2 150 4C200 6 250 6 298 2"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-primary/40"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-lg leading-relaxed"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              Build your perfect protein smoothie. Choose your base, pick a flavor, add boosters, and fuel your day.
            </motion.p>

            <motion.div
              className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/build"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-soft-lg transition-all hover:bg-primary/90 hover:shadow-glow active:scale-95"
              >
                <Zap className="h-4 w-4" />
                Build Your Smoothie
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-2xl border border-border bg-white px-8 py-4 text-base font-semibold text-foreground shadow-soft transition-all hover:bg-secondary hover:border-primary/30 active:scale-95"
              >
                Browse Menu
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="flex items-center justify-center gap-8 pt-4"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              {[
                { value: "58+", label: "Flavors" },
                { value: "36g", label: "Max Protein" },
                { value: "4", label: "Bases" },
                { value: "8", label: "Boosters" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-heading text-xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="h-10 w-6 rounded-full border-2 border-border flex items-start justify-center p-1">
              <div className="h-2 w-1 rounded-full bg-primary" />
            </div>
          </motion.div>
        </section>

        {/* ── Daily Special ──────────────────────────────────── */}
        {todaySpecial && (
          <section className="px-4 pb-10 max-w-3xl mx-auto w-full">
            <Link
              href="/menu"
              className="flex items-center gap-4 rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-5 transition-all hover:border-primary/40 hover:shadow-soft-lg shadow-soft"
            >
              <span className="text-3xl">✨</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Today&apos;s Special — {todaySpecial.day_name}
                </p>
                <p className="font-heading text-xl font-bold mt-0.5 text-foreground">
                  {todaySpecial.item_name}
                </p>
                {todaySpecial.description && (
                  <p className="text-sm text-muted-foreground mt-0.5">{todaySpecial.description}</p>
                )}
              </div>
              <div className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white">
                Order now
              </div>
            </Link>
          </section>
        )}

        {/* ── Smoothie Types ─────────────────────────────────── */}
        {smoothieTypes.length > 0 && (
          <section className="px-4 pb-16 max-w-3xl mx-auto w-full space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">Choose Your Base</h2>
              <Link href="/build" className="text-sm text-primary hover:underline font-medium">
                Start building →
              </Link>
            </div>
            <motion.div
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {smoothieTypes.map((type) => (
                <motion.div
                  key={type.id}
                  variants={fadeUp}
                  transition={{ duration: 0.35 }}
                >
                  <Link
                    href="/build"
                    className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-5 text-center transition-all hover:border-primary/30 hover:shadow-soft-lg active:scale-[0.98] shadow-soft"
                  >
                    <span className="text-3xl">{TYPE_ICONS[type.slug] ?? "🥤"}</span>
                    <span className="font-heading text-lg font-bold">{type.name}</span>
                    <span className="text-sm text-primary font-semibold">{type.protein}g protein</span>
                    <span className="text-xs text-muted-foreground">{type.calories} cal</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* ── Features ───────────────────────────────────────── */}
        <section className="px-4 pb-16 max-w-3xl mx-auto w-full">
          <motion.div
            className="text-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="font-heading text-2xl font-bold">Why Smoothie Protein Bar?</h2>
            <p className="text-muted-foreground mt-2">Crafted for performance. Built for taste.</p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {FEATURES.map((feat) => (
              <motion.div
                key={feat.title}
                className="rounded-2xl border border-border bg-white p-6 space-y-2 transition-all hover:border-primary/20 hover:shadow-soft-lg shadow-soft"
                variants={fadeUp}
                transition={{ duration: 0.4 }}
              >
                <span className="text-3xl">{feat.icon}</span>
                <h3 className="font-heading font-semibold text-lg">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── About / CTA ────────────────────────────────────── */}
        <section
          id="about"
          className="px-4 pb-20 max-w-3xl mx-auto w-full"
        >
          <motion.div
            className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 sm:p-10 text-white text-center space-y-4 shadow-soft-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-4xl">🥤</span>
            <h2 className="font-heading text-3xl font-bold">Ready to fuel up?</h2>
            <p className="text-white/80 text-base leading-relaxed max-w-sm mx-auto">
              Order online and pick up at the bar, or build your perfect smoothie in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/build"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3.5 font-semibold text-primary shadow transition-all hover:bg-white/90 active:scale-95"
              >
                <Zap className="h-4 w-4" />
                Build a Smoothie
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-7 py-3.5 font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
              >
                See Full Menu
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ── Landing footer nav (mobile) ─────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/90 backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-2">
          {[
            { href: "/", label: "Home", icon: "🏠" },
            { href: "/menu", label: "Menu", icon: "🍽" },
            { href: "/cart", label: "Orders", icon: "🛒" },
            { href: "/profile", label: "Profile", icon: "👤" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
