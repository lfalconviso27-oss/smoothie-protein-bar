"use server";

import { createClient } from "@/lib/supabase/server";
import { generateOrderNumber } from "@/lib/utils";
import type { Order, OrderItem, StatusEvent } from "@/types/database";

export async function createOrder(data: {
  items: Array<{
    productType: string;
    name: string;
    quantity: number;
    unitPrice: number;
    buildDetails: object;
    nutrition: object;
  }>;
  orderType: string;
  deliveryAddress?: { street: string; city: string; zip: string };
  notes?: string;
  promoCode?: string;
  stripePaymentIntentId: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const subtotal = data.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.0875);
  const deliveryFee = data.orderType === "delivery" ? 499 : 0;
  const total = subtotal + tax + deliveryFee;
  const loyaltyPointsEarned = Math.floor(total / 100);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      order_number: generateOrderNumber(),
      status: "pending",
      order_type: data.orderType,
      subtotal,
      tax,
      delivery_fee: deliveryFee,
      total,
      loyalty_points_earned: loyaltyPointsEarned,
      stripe_payment_intent_id: data.stripePaymentIntentId,
      stripe_payment_status: "pending",
      delivery_address: data.deliveryAddress ?? null,
      notes: data.notes ?? null,
      promo_code: data.promoCode ?? null,
      estimated_ready_at: new Date(
        Date.now() + 15 * 60 * 1000
      ).toISOString(),
    } as never)
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = data.items.map((item) => ({
    order_id: (order as { id: string }).id,
    product_type: item.productType,
    name: item.name,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.unitPrice * item.quantity,
    build_details: item.buildDetails,
    nutrition_snapshot: item.nutrition,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems as never);

  if (itemsError) throw itemsError;

  return order as { id: string; order_number: string };
}

export async function getOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function getOrderById(
  id: string
): Promise<{ order: Order; items: OrderItem[]; events: StatusEvent[] } | null> {
  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  const { data: events } = await supabase
    .from("order_status_events")
    .select("*")
    .eq("order_id", id)
    .order("created_at");

  return {
    order: order as Order,
    items: (items ?? []) as OrderItem[],
    events: (events ?? []) as StatusEvent[],
  };
}
