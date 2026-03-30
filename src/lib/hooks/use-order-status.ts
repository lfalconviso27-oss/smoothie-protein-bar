"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type StatusEvent = Database["public"]["Tables"]["order_status_events"]["Row"];

export function useOrderStatus(orderId: string, initialOrder: Order, initialEvents: StatusEvent[]) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [events, setEvents] = useState<StatusEvent[]>(initialEvents);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder((prev) => ({ ...prev, ...payload.new }));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "order_status_events",
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          setEvents((prev) => [...prev, payload.new as StatusEvent]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, supabase]);

  return { order, events };
}
