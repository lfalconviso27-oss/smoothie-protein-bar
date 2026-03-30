"use client";

import { useOrderStatus } from "@/lib/hooks/use-order-status";
import { OrderStatusTracker } from "@/components/order/order-status-tracker";
import { formatPrice } from "@/lib/utils";
import type { Database } from "@/types/database";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
type StatusEvent = Database["public"]["Tables"]["order_status_events"]["Row"];

interface OrderTrackingClientProps {
  initialOrder: Order;
  initialItems: OrderItem[];
  initialEvents: StatusEvent[];
}

export function OrderTrackingClient({
  initialOrder,
  initialItems,
  initialEvents,
}: OrderTrackingClientProps) {
  const { order, events } = useOrderStatus(
    initialOrder.id,
    initialOrder,
    initialEvents
  );

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold">Order Tracking</h1>
        <p className="text-sm text-muted-foreground font-mono">
          {order.order_number}
        </p>
      </div>

      <OrderStatusTracker currentStatus={order.status} />

      {order.estimated_ready_at && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Estimated ready</p>
          <p className="font-heading font-bold text-lg text-primary">
            {new Date(order.estimated_ready_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      )}

      {/* Items */}
      <div className="space-y-2">
        <h2 className="font-heading font-semibold">Items</h2>
        {initialItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm p-3 bg-white rounded-2xl border border-border shadow-soft"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p>{formatPrice(item.total_price)}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      {events.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-heading font-semibold">Timeline</h2>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex gap-3 text-sm">
                <div className="flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <div className="w-px flex-1 bg-border" />
                </div>
                <div className="pb-3">
                  <p className="font-medium capitalize">
                    {event.status.replace("_", " ")}
                  </p>
                  {event.message && (
                    <p className="text-xs text-muted-foreground">
                      {event.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-center font-bold">
        Total: {formatPrice(order.total)}
      </div>
    </div>
  );
}
