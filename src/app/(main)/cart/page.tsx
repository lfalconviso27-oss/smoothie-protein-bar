"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { SmoothieBuildDetails, CartItem } from "@/types/cart";

function getItemSubtitle(item: CartItem): string {
  if (item.productType === "smoothie") {
    const d = item.details as SmoothieBuildDetails;
    const parts = [d.smoothieTypeName, d.flavorCategory];
    if (d.boosterNames.length > 0) {
      parts.push(`+${d.boosterNames.length} boosters`);
    }
    return parts.join(" · ");
  }
  return item.productType.charAt(0).toUpperCase() + item.productType.slice(1);
}

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="font-heading text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">
          Build a smoothie or browse the menu.
        </p>
        <div className="flex gap-3 mt-6">
          <Link
            href="/build"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90 active:scale-95"
          >
            Build Smoothie
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-2xl border border-border px-6 py-3 font-semibold transition-all hover:bg-secondary active:scale-95"
          >
            Menu
          </Link>
        </div>
      </div>
    );
  }

  const tax = Math.round(subtotal * 0.0875);
  const total = subtotal + tax;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="font-heading text-2xl font-bold">Cart</h1>

      <div className="mt-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-border shadow-soft"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {getItemSubtitle(item)} &middot;{" "}
                  {formatPrice(item.unitPrice)} each
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.nutrition.calories} cal &middot; {item.nutrition.protein}g protein
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    item.quantity > 1
                      ? updateQuantity(item.id, item.quantity - 1)
                      : removeItem(item.id)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-colors"
                >
                  {item.quantity === 1 ? (
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  ) : (
                    <Minus className="h-3.5 w-3.5" />
                  )}
                </button>
                <span className="w-6 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="font-semibold text-sm w-16 text-right">
                {formatPrice(item.unitPrice * item.quantity)}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Totals */}
      <div className="mt-6 space-y-2 rounded-2xl border border-border bg-white p-4 text-sm shadow-soft">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <div className="mt-4">
        <Link href="/checkout">
          <Button size="lg" className="w-full text-base font-bold h-12 rounded-2xl">
            Checkout &middot; {formatPrice(total)}
          </Button>
        </Link>
      </div>
    </div>
  );
}
