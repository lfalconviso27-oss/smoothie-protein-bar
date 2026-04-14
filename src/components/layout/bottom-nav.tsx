"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, UtensilsCrossed, ShoppingCart, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { LimelightNav, type NavItem } from "@/components/ui/limelight-nav";
import React from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed, exact: false },
  { href: "/cart", label: "Orders", icon: ShoppingCart, exact: false },
  { href: "/profile", label: "Profile", icon: User, exact: false },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const itemCount = useCartStore((s) => s.itemCount());

  // Builder has its own bottom nav — hide global one to avoid overlay
  if (pathname === "/build") return null;

  const activeIndex = NAV_ITEMS.findIndex(({ href, exact }) =>
    exact ? pathname === href : pathname.startsWith(href)
  );

  const navItems: NavItem[] = NAV_ITEMS.map(({ href, label, icon: Icon }, i) => ({
    id: href,
    label,
    icon:
      label === "Orders" ? (
        <div className="relative">
          <ShoppingCart />
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </div>
      ) : (
        <Icon />
      ),
    onClick: () => router.push(href),
  }));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)] flex items-center justify-center bg-white/90 backdrop-blur-xl border-t border-border">
      <LimelightNav
        items={navItems}
        activeIndex={activeIndex >= 0 ? activeIndex : 0}
        className="w-full max-w-sm rounded-none border-0 shadow-none bg-transparent h-14"
        iconContainerClassName="flex-1"
      />
    </div>
  );
}
