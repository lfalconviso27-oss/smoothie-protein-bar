"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Zap,
  Leaf,
  Dumbbell,
  Sparkles,
  Sliders,
  Menu,
  X,
  Phone,
  MapPin,
  ArrowRight,
  Star,
  Home,
  UtensilsCrossed,
  User,
  ChevronRight,
  Clock,
  Droplets,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { useUser } from "@/lib/hooks/use-user";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { AnimatedHeroWord } from "@/components/ui/animated-hero";
import { PerspectiveMarquee } from "@/components/ui/perspective-marquee";
import { fadeUp, staggerContainer } from "@/components/shared/motion";
import type { DailySpecial, SmoothieType } from "@/types/database";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const HERO_WORDS = ["Energizing", "Refreshing", "Powerful", "Delicious", "Nutritious"];

const MARQUEE_ITEMS = [
  "Raspberry Cream", "Mango Tango", "Vanilla Dream", "Strawberry Fields",
  "Chocolate Rush", "Peach Sunrise", "Coffee Bliss", "Blueberry Burst",
  "Coconut Lime", "Pineapple Punch", "Cherry Bomb", "Green Machine",
];

const FEATURES = [
  {
    icon: Sliders,
    title: "Custom Builds",
    desc: "Choose your type, flavor, and boosters — built exactly how you want it.",
    color: "bg-violet-50",
    iconColor: "text-primary",
  },
  {
    icon: Dumbbell,
    title: "Up to 36g Protein",
    desc: "Fuel your goals with Basic, Fit, Power, or Vegan options.",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Leaf,
    title: "Fresh & Natural",
    desc: "Real ingredients, 58+ unique flavors, and plant-based options.",
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Sparkles,
    title: "Boosters & Enhancers",
    desc: "Energy, Collagen, Probiotics, and more — mix and match freely.",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

const TYPE_CARDS: Record<string, {
  gradient: string;
  icon: typeof Droplets;
  label: string;
  ring: string;
}> = {
  basic: {
    gradient: "from-sky-400 via-blue-500 to-cyan-500",
    icon: Droplets,
    label: "Refreshing",
    ring: "bg-white/20",
  },
  fit: {
    gradient: "from-emerald-400 via-green-500 to-teal-500",
    icon: Leaf,
    label: "Lean & Clean",
    ring: "bg-white/20",
  },
  power: {
    gradient: "from-violet-500 via-purple-600 to-primary",
    icon: Dumbbell,
    label: "Max Gains",
    ring: "bg-white/20",
  },
  vegan: {
    gradient: "from-rose-400 via-pink-500 to-fuchsia-500",
    icon: Sparkles,
    label: "Plant Based",
    ring: "bg-white/20",
  },
};

const BOTTOM_NAV = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed, exact: false },
  { href: "/cart", label: "Orders", icon: ShoppingCart, exact: false },
  { href: "/profile", label: "Profile", icon: User, exact: false },
];

// Animated counter that counts up when it enters the viewport
function AnimatedStat({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const timeout = setTimeout(() => {
      let start = 0;
      const duration = 900;
      const step = 16;
      const inc = value / (duration / step);
      const id = setInterval(() => {
        start += inc;
        if (start >= value) { setCount(value); clearInterval(id); }
        else setCount(Math.floor(start));
      }, step);
      return () => clearInterval(id);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [started, value, delay]);

  return (
    <div ref={ref} className="text-center">
      <motion.p
        className="font-heading text-2xl font-extrabold text-primary"
        initial={{ opacity: 0, y: 10 }}
        animate={started ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay }}
      >
        {count}{suffix}
      </motion.p>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

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
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl">
              <Image
                src="/spb-logo.png"
                alt="Smoothie Protein Bar"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight">
              <span className="text-primary">Smoothie</span>
              <span className="text-foreground"> Protein Bar</span>
            </span>
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
                className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-secondary transition-colors"
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
                className="hidden md:inline-flex text-sm font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-2 rounded-xl hover:bg-primary/5"
              >
                Sign in
              </Link>
            )}

            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-white px-4 pb-4 overflow-hidden"
            >
              <nav className="flex flex-col gap-1 pt-3">
                {[
                  { href: "/menu", label: "Menu" },
                  { href: "/build", label: "Order Now" },
                  { href: "/#about", label: "About" },
                  { href: "/login", label: "Sign in" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pb-20 md:pb-0">

        {/* ── Hero with Aurora Background ────────────────────── */}
        <AuroraBackground className="min-h-[90vh] px-6 text-center">
          {/* Watermark logo */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
            <Image
              src="/spb-logo.png"
              alt=""
              width={500}
              height={500}
              className="object-contain select-none"
              priority
            />
          </div>

          <motion.div
            className="relative z-10 space-y-6 max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-5 py-2 text-xs font-bold text-primary uppercase tracking-widest">
                <Star className="h-3 w-3 fill-primary" />
                58+ Unique Flavors
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-foreground"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              Fuel Your Day
              <br />
              <AnimatedHeroWord words={HERO_WORDS} className="text-5xl sm:text-6xl lg:text-7xl" />
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl mx-auto"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              Build your perfect protein smoothie. Choose your base, pick a flavor,
              add boosters, and fuel your day — all in under a minute.
            </motion.p>

            <motion.div
              className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              <motion.div className="relative" whileHover="hover" whileTap={{ scale: 0.96 }}>
                {/* Pulse rings */}
                <motion.span
                  className="absolute inset-0 rounded-2xl bg-primary"
                  variants={{ hover: { scale: 1.12, opacity: 0 } }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <motion.span
                  className="absolute inset-0 rounded-2xl bg-primary"
                  variants={{ hover: { scale: 1.22, opacity: 0 } }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
                />
                <Link
                  href="/build"
                  className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-white shadow-soft-lg transition-colors hover:bg-primary/90"
                >
                  <motion.span variants={{ hover: { rotate: 20 } }} transition={{ type: "spring", stiffness: 400 }}>
                    <Zap className="h-4 w-4" />
                  </motion.span>
                  Build Your Smoothie
                  <motion.span variants={{ hover: { x: 4 } }} transition={{ type: "spring", stiffness: 400 }}>
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </motion.div>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-white/80 px-8 py-4 text-base font-bold text-foreground shadow-soft transition-all hover:bg-white hover:border-primary/30 active:scale-95"
              >
                Browse Menu
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex items-center justify-center gap-8 pt-4 pb-2"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              {[
                { value: 58, suffix: "+", label: "Flavors" },
                { value: 36, suffix: "g", label: "Max Protein" },
                { value: 4, suffix: "", label: "Bases" },
                { value: 9, suffix: "", label: "Boosters" },
              ].map((stat, i) => (
                <AnimatedStat key={stat.label} {...stat} delay={i * 0.12} />
              ))}
            </motion.div>
          </motion.div>

        </AuroraBackground>

        {/* ── Marquee ───────────────────────────────────────── */}
        <section className="py-10 overflow-hidden bg-white border-y border-border">
          <PerspectiveMarquee items={MARQUEE_ITEMS} />
        </section>

        {/* ── Daily Special ─────────────────────────────────── */}
        {todaySpecial && (
          <section className="px-4 py-10 max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
            <Link
              href="/menu"
              className="group flex items-center gap-5 rounded-3xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-primary/8 to-purple-50 p-6 transition-all hover:border-primary/40 hover:shadow-soft-lg shadow-soft"
            >
              <motion.div
                className="shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              >
                <Star className="h-7 w-7 fill-primary/20" />
              </motion.div>
              <div className="flex-1">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">
                  Today&apos;s Special — {todaySpecial.day_name}
                </p>
                <p className="font-heading text-xl font-bold mt-0.5 text-foreground">
                  {todaySpecial.item_name}
                </p>
                {todaySpecial.description && (
                  <p className="text-sm text-muted-foreground mt-0.5">{todaySpecial.description}</p>
                )}
              </div>
              <div className="shrink-0 flex items-center gap-1 rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-white group-hover:bg-primary/90 transition-colors">
                Order now
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
            </motion.div>
          </section>
        )}

        {/* ── Smoothie Types ────────────────────────────────── */}
        {smoothieTypes.length > 0 && (
          <section className="px-4 pb-16 max-w-4xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold">Choose Your Base</h2>
                <p className="text-sm text-muted-foreground mt-1">Four bases, different macros — find your match.</p>
              </div>
              <Link
                href="/build"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Start building <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <motion.div
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {smoothieTypes.map((type, i) => (
                <motion.div
                  key={type.id}
                  variants={fadeUp}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/build"
                    className="group flex flex-col rounded-3xl border border-border bg-white overflow-hidden shadow-soft"
                    style={{ display: "flex" }}
                  >
                    {(() => {
                      const card = TYPE_CARDS[type.slug] ?? TYPE_CARDS.basic;
                      const Icon = card.icon;
                      return (
                        <div className={`relative h-36 w-full overflow-hidden bg-gradient-to-br ${card.gradient}`}>
                          {/* Ghost icon watermark */}
                          <Icon className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10 rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" />
                          {/* Center icon badge */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.ring} backdrop-blur-sm transition-transform duration-300 group-hover:scale-110`}>
                              <Icon className="h-7 w-7 text-white drop-shadow" />
                            </div>
                          </div>
                          {/* Label */}
                          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white/70">
                            {card.label}
                          </span>
                          {/* Hover shimmer */}
                          <motion.div
                            className="absolute inset-0 bg-white/10 opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.25 }}
                          />
                        </div>
                      );
                    })()}
                    <div className="p-4 space-y-1">
                      <span className="font-heading text-base font-bold">{type.name}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-primary">{type.protein}g protein</span>
                        <span className="text-muted-foreground">{type.calories} cal</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* ── Why SPB ──────────────────────────────────────── */}
        <section className="px-4 pb-16 max-w-4xl mx-auto w-full">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="font-heading text-3xl font-bold">Why Smoothie Protein Bar?</h2>
            <p className="text-muted-foreground mt-2">Crafted for performance. Built for taste.</p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  className="flex gap-4 rounded-3xl border border-border bg-white p-6 shadow-soft cursor-default"
                  variants={fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(123,92,240,0.14)", borderColor: "rgba(123,92,240,0.25)" }}
                >
                  <motion.div
                    className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl ${feat.color}`}
                    whileHover={{ scale: 1.15, rotate: -6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className={`h-6 w-6 ${feat.iconColor}`} />
                  </motion.div>
                  <div>
                    <h3 className="font-heading font-bold text-base">{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ── About / CTA ──────────────────────────────────── */}
        <section id="about" className="px-4 pb-16 max-w-4xl mx-auto w-full">
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {/* Background image */}
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=1200&q=80"
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/85" />
            </div>

            {/* Watermark logo */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 flex items-center justify-end pr-8 opacity-10">
              <Image src="/spb-logo.png" alt="" width={280} height={280} className="object-contain" />
            </div>

            <div className="relative z-10 p-10 sm:p-14 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Ready to fuel up?</p>
              <h2 className="font-heading text-4xl font-extrabold mb-4">
                Your perfect<br />smoothie awaits.
              </h2>
              <p className="text-white/80 text-base leading-relaxed max-w-sm mb-8">
                Order online and pick up at the bar, or build your perfect smoothie in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/build"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3.5 font-bold text-primary shadow transition-all hover:bg-white/90 active:scale-95"
                >
                  <Zap className="h-4 w-4" />
                  Build a Smoothie
                </Link>
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/30 px-7 py-3.5 font-bold text-white transition-all hover:bg-white/10 active:scale-95"
                >
                  View Full Menu
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Contact & Location ───────────────────────────── */}
        <section className="px-4 pb-16 max-w-4xl mx-auto w-full">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.a
              href="tel:+14802321192"
              variants={fadeUp}
              className="flex items-center gap-4 rounded-3xl border border-border bg-white p-6 shadow-soft hover:border-primary/30 hover:shadow-soft-lg transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Call Us</p>
                <p className="font-heading font-bold text-foreground mt-0.5">480-232-1192</p>
              </div>
            </motion.a>

            <motion.a
              href="https://maps.google.com/?q=5985+NW+102nd+Ave+Doral+FL+33178"
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              className="flex items-center gap-4 rounded-3xl border border-border bg-white p-6 shadow-soft hover:border-primary/30 hover:shadow-soft-lg transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Visit Us</p>
                <p className="font-heading font-bold text-foreground mt-0.5 text-sm leading-tight">
                  5985 NW 102nd Ave<br />Doral, FL 33178
                </p>
              </div>
            </motion.a>
          </motion.div>
        </section>

        {/* ── Footer ──────────────────────────────────────── */}
        <footer className="border-t border-border bg-white">
          <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-xl">
                  <Image src="/spb-logo.png" alt="SPB" fill className="object-cover" sizes="40px" />
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground">Smoothie Protein Bar</p>
                  <p className="text-xs text-muted-foreground">5985 NW 102nd Ave, Doral, FL 33178</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link href="/menu" className="hover:text-primary transition-colors font-medium">Menu</Link>
                <Link href="/build" className="hover:text-primary transition-colors font-medium">Order</Link>
                <a href="tel:+14802321192" className="hover:text-primary transition-colors font-medium">Contact</a>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} Smoothie Protein Bar. All rights reserved.</p>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Mon – Sat 7am – 8pm · Sun 9am – 6pm</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ── Mobile Bottom Nav ────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-2">
          {BOTTOM_NAV.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs font-semibold transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="home-nav-indicator"
                    className="absolute -top-2 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
