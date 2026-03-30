import { getOrders } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Order History",
};

export default async function OrderHistoryPage() {
  const orders = await getOrders();

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
      <h1 className="font-heading text-2xl font-bold">Order History</h1>

      {orders.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No orders yet.</p>
          <Link
            href="/menu"
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order/${order.id}`}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-border hover:border-primary/30 transition-all shadow-soft"
            >
              <div>
                <p className="font-mono font-medium">{order.order_number}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()} at{" "}
                  {new Date(order.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-xs text-muted-foreground capitalize mt-1">
                  {order.order_type} &middot; {order.status.replace("_", " ")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(order.total)}</p>
                {order.loyalty_points_earned > 0 && (
                  <p className="text-xs text-primary font-medium">
                    +{order.loyalty_points_earned} pts
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
