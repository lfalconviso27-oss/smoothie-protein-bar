import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const stripe = getStripeServer();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    // Update order status
    const { data: orders } = await supabase
      .from("orders")
      .select("id, user_id, total")
      .eq("stripe_payment_intent_id", paymentIntent.id)
      .limit(1);

    const order = orders?.[0] as { id: string; user_id: string; total: number } | undefined;
    if (order) {
      await supabase
        .from("orders")
        .update({
          status: "confirmed",
          stripe_payment_status: "succeeded",
        })
        .eq("id", order.id);

      // Create status event
      await supabase.from("order_status_events").insert({
        order_id: order.id,
        status: "confirmed",
        message: "Payment received! Your smoothie is being prepared.",
      });

      // Award loyalty points
      const pointsEarned = Math.floor(order.total / 100);
      if (pointsEarned > 0) {
        await supabase.from("loyalty_transactions").insert({
          user_id: order.user_id,
          order_id: order.id,
          points: pointsEarned,
          type: "earned",
          description: `Earned from order`,
        });
      }
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    await supabase
      .from("orders")
      .update({
        status: "cancelled",
        stripe_payment_status: "failed",
      })
      .eq("stripe_payment_intent_id", paymentIntent.id);
  }

  return NextResponse.json({ received: true });
}
