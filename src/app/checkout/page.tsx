"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { createOrder } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { SmoothieBuildDetails } from "@/types/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);

  const tax = Math.round(subtotal * 0.0875);
  const deliveryFee = orderType === "delivery" ? 499 : 0;
  const total = subtotal + tax + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Nothing to checkout</h1>
        <p className="text-muted-foreground mt-2">Add items to your cart first.</p>
      </div>
    );
  }

  async function handleCheckout() {
    setPending(true);
    try {
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) throw new Error("Payment failed");
      const { paymentIntentId } = await res.json();

      const order = await createOrder({
        items: items.map((item) => ({
          productType: item.productType,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          buildDetails: item.details,
          nutrition: item.nutrition,
        })),
        orderType,
        notes: notes || undefined,
        stripePaymentIntentId: paymentIntentId,
      });

      clearCart();
      toast.success("Order placed!");
      router.push(`/checkout/success?order=${order.order_number}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
      setPending(false);
    }
  }

  function getItemSubtitle(item: (typeof items)[0]): string {
    if (item.productType === "smoothie") {
      const details = item.details as SmoothieBuildDetails;
      const parts = [details.smoothieTypeName];
      if (details.boosterNames.length > 0) {
        parts.push(`+${details.boosterNames.length} boosters`);
      }
      return parts.join(" · ");
    }
    return item.productType;
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto space-y-6">
      <h1 className="font-heading text-2xl font-bold">Checkout</h1>

      {/* Order Type */}
      <div className="space-y-2">
        <Label>Order Type</Label>
        <div className="flex gap-2">
          {(["pickup", "delivery"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-medium capitalize transition-all ${
                orderType === type
                  ? "border-primary bg-primary/10 text-primary shadow-soft"
                  : "border-border hover:border-primary/30"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Order Review */}
      <div className="space-y-3">
        <h2 className="font-heading font-semibold">Your Order</h2>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm p-3 bg-white rounded-2xl border border-border shadow-soft"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {getItemSubtitle(item)} &middot; Qty: {item.quantity}
              </p>
            </div>
            <p className="font-medium">
              {formatPrice(item.unitPrice * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Special Instructions</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any allergies or preferences?"
          className="rounded-xl"
        />
      </div>

      {/* Totals */}
      <div className="space-y-2 rounded-2xl border border-border bg-white p-4 text-sm shadow-soft">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full text-base font-bold h-12 rounded-2xl"
        onClick={handleCheckout}
        disabled={pending}
      >
        {pending ? "Processing..." : `Pay ${formatPrice(total)}`}
      </Button>
    </div>
  );
}
