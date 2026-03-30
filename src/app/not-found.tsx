import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">Page not found</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
}
