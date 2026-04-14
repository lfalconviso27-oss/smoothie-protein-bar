"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart-store";
import { useUser } from "@/lib/hooks/use-user";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/build", label: "Order" },
  { href: "/#about", label: "About" },
];

export function Header() {
  const itemCount = useCartStore((s) => s.itemCount());
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 max-w-6xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl shadow-soft">
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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center rounded-xl h-9 w-9 hover:bg-secondary transition-colors"
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
              className="inline-flex items-center justify-center rounded-full h-8 w-8 bg-primary text-white text-xs font-bold ml-1"
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
        </div>
      </div>
    </header>
  );
}
