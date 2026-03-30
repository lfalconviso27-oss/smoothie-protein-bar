import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/actions/orders";
import { OrderTrackingClient } from "./order-tracking-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderTrackingPage({ params }: Props) {
  const { id } = await params;
  const data = await getOrderById(id);
  if (!data) notFound();

  return (
    <OrderTrackingClient
      initialOrder={data.order}
      initialItems={data.items}
      initialEvents={data.events}
    />
  );
}
