import Link from "next/link";

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center space-y-6 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="text-6xl">🎉</div>
      <h1 className="font-heading text-3xl font-bold">Order Placed!</h1>
      {order && (
        <p className="text-lg text-muted-foreground">
          Order <span className="text-primary font-mono font-bold">{order}</span>
        </p>
      )}
      <p className="text-muted-foreground max-w-sm">
        Your smoothie is being prepared. Estimated ready time: 10-15 minutes.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs pt-4">
        <Link
          href="/profile/orders"
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90"
        >
          View Orders
        </Link>
        <Link
          href="/menu"
          className="inline-flex items-center justify-center rounded-2xl border border-border px-6 py-3 font-semibold transition-all hover:bg-secondary"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
