"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  loadStripe,
  type StripePaymentElementOptions,
} from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  CupSoda,
  Truck,
  Store,
  Star,
  User,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { SmoothieBuildDetails } from "@/types/cart";

// Only load Stripe if the key is a real publishable key (pk_test_... or pk_live_...)
const rawStripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripeKeyValid = rawStripeKey.startsWith("pk_test_") || rawStripeKey.startsWith("pk_live_");
const stripePromise = stripeKeyValid ? loadStripe(rawStripeKey) : null;

// ── Inner checkout form ───────────────────────────────────

function CheckoutForm({
  totalCents,
  customerName,
}: {
  totalCents: number;
  customerName: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Payment failed");
      setIsProcessing(false);
      return;
    }

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalCents,
        metadata: { customer_name: customerName },
      }),
    });

    const { clientSecret, error: apiError } = await res.json();
    if (apiError) {
      setError(apiError);
      setIsProcessing(false);
      return;
    }

    const successUrl = `${window.location.origin}/checkout/success?name=${encodeURIComponent(customerName)}`;

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: successUrl },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed");
      setIsProcessing(false);
    } else {
      setSucceeded(true);
      clearCart();
      setTimeout(
        () =>
          router.push(
            `/checkout/success?name=${encodeURIComponent(customerName)}`
          ),
        1500
      );
    }
  }

  if (succeeded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center gap-4 py-8"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="font-heading text-2xl font-bold">Payment Confirmed!</h2>
        <p className="text-muted-foreground">Redirecting to your order…</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement
        options={
          {
            layout: "tabs",
            wallets: { applePay: "auto", googlePay: "auto" },
          } as StripePaymentElementOptions
        }
        onLoadError={() => {
          setError("Payment form failed to load. Please refresh and try again.");
        }}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3"
        >
          {error}
        </motion.p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={!stripe || !elements || isProcessing || !customerName.trim()}
        className="w-full h-14 text-base font-bold rounded-2xl gap-2"
      >
        <Lock className="h-4 w-4" />
        {isProcessing ? "Processing…" : `Pay ${formatPrice(totalCents)}`}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
        <span>Secured by Stripe · 256-bit TLS · PCI compliant</span>
      </div>
    </form>
  );
}

// ── Page ─────────────────────────────────────────────────

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const router = useRouter();
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [customerName, setCustomerName] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const tax = Math.round(subtotal * 0.0875);
  const deliveryFee = orderType === "delivery" ? 499 : 0;
  const totalCents = subtotal + tax + deliveryFee;

  useEffect(() => {
    setHydrated(true);
  }, []);

  const stripeOptions = {
    mode: "payment" as const,
    amount: totalCents > 0 ? totalCents : 100,
    currency: "usd",
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#7B5CF0",
        colorBackground: "#ffffff",
        colorText: "#1a1a2e",
        colorDanger: "#ef4444",
        fontFamily: "Inter, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "12px",
      },
    },
  };

  useEffect(() => {
    if (hydrated && items.length === 0) router.replace("/cart");
  }, [hydrated, items.length, router]);

  if (!hydrated || items.length === 0) return null;

  function getItemSubtitle(item: (typeof items)[0]): string {
    if (item.productType === "smoothie") {
      const d = item.details as SmoothieBuildDetails;
      const parts = [d.smoothieTypeName];
      if (d.boosterNames.length > 0) parts.push(`+${d.boosterNames.length} boosters`);
      return parts.join(" · ");
    }
    return item.productType.charAt(0).toUpperCase() + item.productType.slice(1);
  }

  const missingKey = !stripeKeyValid;

  return (
    <div className="min-h-screen bg-[#faf8fc]">
      <div className="px-4 py-8 max-w-lg mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold">Checkout</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" /> Secure payment powered by Stripe
            </p>
          </div>
        </div>

        {/* Your Info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-4"
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <h2 className="font-heading font-bold text-sm">Your Info</h2>
          </div>

          {/* Name field */}
          <div className="space-y-1.5">
            <label
              htmlFor="customer-name"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Your Name <span className="text-destructive">*</span>
            </label>
            <input
              id="customer-name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full rounded-xl border border-border bg-[#faf8fc] px-4 py-3 text-sm font-medium placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <p className="text-xs text-muted-foreground">
              So we know whose order to call out!
            </p>
          </div>

          {/* Loyalty sign-in callout */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 cursor-pointer group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Star className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground">
                Earn loyalty points on this order
              </p>
              <p className="text-xs text-muted-foreground">
                1 point per $1 spent · Bronze → Silver → Gold → Platinum
              </p>
            </div>
            <Link
              href="/login"
              className="shrink-0 flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </Link>
          </motion.div>
        </motion.div>

        {/* Order type */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="space-y-2"
        >
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Order Type
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(["pickup", "delivery"] as const).map((type) => {
              const Icon = type === "pickup" ? Store : Truck;
              return (
                <motion.button
                  key={type}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setOrderType(type)}
                  className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-sm font-bold capitalize transition-all ${
                    orderType === type
                      ? "border-primary bg-primary/10 text-primary shadow-soft"
                      : "border-border bg-white hover:border-primary/30"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {type}
                  {type === "delivery" && (
                    <span className="text-xs text-muted-foreground font-normal">
                      +$4.99
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-3"
        >
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Order Summary
          </h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between text-sm gap-2"
              >
                <div>
                  <p className="font-semibold">
                    {item.quantity}× {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getItemSubtitle(item)}
                  </p>
                </div>
                <span className="font-bold shrink-0">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (8.75%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <AnimatePresence>
              {deliveryFee > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between text-muted-foreground"
                >
                  <span>Delivery</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatPrice(totalCents)}</span>
            </div>
          </div>
        </motion.div>

        {/* Payment */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-2xl border border-border bg-white p-5 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-5">
            <Lock className="h-4 w-4 text-primary" />
            <h2 className="font-heading font-bold text-sm">Payment Details</h2>
          </div>

          {missingKey ? (
            <div className="space-y-4 text-center py-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-heading font-bold text-base">Payments not yet activated</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  To accept Apple Pay, card, and bank payments, add your Stripe keys to{" "}
                  <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">.env.local</code>
                  {" "}and restart the server.
                </p>
              </div>
              <div className="rounded-xl bg-secondary p-3 text-left space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Add to .env.local</p>
                <pre className="text-xs text-foreground font-mono whitespace-pre-wrap leading-relaxed">
{`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...`}
                </pre>
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline mt-1"
                >
                  Get your keys at dashboard.stripe.com →
                </a>
              </div>
            </div>
          ) : !hydrated ? (
            <div className="h-32 animate-pulse rounded-xl bg-secondary" />
          ) : (
            <Elements key={totalCents} stripe={stripePromise} options={stripeOptions}>
              <CheckoutForm
                totalCents={totalCents}
                customerName={customerName}
              />
            </Elements>
          )}
        </motion.div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pb-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CupSoda className="h-3.5 w-3.5 text-primary" />
            <span>SPB Doral</span>
          </div>
        </div>
      </div>
    </div>
  );
}
