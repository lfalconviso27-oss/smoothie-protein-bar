import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-primary/5 to-transparent">
      <Link href="/" className="font-heading text-xl font-bold tracking-tight mb-8">
        <span className="text-primary">Smoothie</span>
        <span className="text-foreground"> Protein Bar</span>
      </Link>
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border bg-white p-6 shadow-soft">
        {children}
      </div>
    </div>
  );
}
