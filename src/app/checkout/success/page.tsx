import Link from "next/link";
import { CheckCircle2, Clock, Star } from "lucide-react";

interface Props {
  searchParams: Promise<{ order?: string; name?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order, name } = await searchParams;
  const displayName = name ? decodeURIComponent(name) : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center space-y-6 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>

      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold">
          {displayName ? `Thanks, ${displayName.split(" ")[0]}!` : "Order Placed!"}
        </h1>
        {order && (
          <p className="text-lg text-muted-foreground">
            Order{" "}
            <span className="text-primary font-mono font-bold">{order}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-white px-5 py-3 shadow-soft text-sm text-muted-foreground">
        <Clock className="h-4 w-4 text-primary" />
        <span>
          Estimated ready time:{" "}
          <strong className="text-foreground">10–15 minutes</strong>
        </span>
      </div>

      <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
        Your smoothie is being prepared fresh at our Doral location. We&apos;ll
        have it ready for you shortly!
      </p>

      {/* Points callout for guests */}
      <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-3 max-w-xs w-full">
        <Star className="h-4 w-4 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground text-left">
          <span className="font-bold text-foreground">Create an account</span>{" "}
          to earn loyalty points on every order — Bronze, Silver, Gold, and
          Platinum rewards await!
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs pt-2">
        <Link
          href="/menu"
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3.5 font-bold text-white transition-all hover:bg-primary/90 active:scale-95"
        >
          Back to Menu
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-2xl border border-border px-6 py-3.5 font-bold transition-all hover:bg-secondary active:scale-95"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
