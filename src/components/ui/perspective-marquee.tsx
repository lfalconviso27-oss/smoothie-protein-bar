"use client";

import { cn } from "@/lib/utils";

interface PerspectiveMarqueeProps {
  items: string[];
  className?: string;
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
}

export function PerspectiveMarquee({
  items,
  className,
  speed = "normal",
  direction = "left",
}: PerspectiveMarqueeProps) {
  const duration =
    speed === "slow" ? "60s" : speed === "fast" ? "18s" : "32s";
  // triple the items for a smooth seamless loop
  const tripled = [...items, ...items, ...items];

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ perspective: "900px" }}
    >
      {/* Left fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
      {/* Right fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

      <div
        style={{
          transform: "rotateX(6deg) rotateY(-10deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="flex whitespace-nowrap gap-10 will-change-transform"
          style={{
            animation: `marquee-${direction} ${duration} linear infinite`,
          }}
        >
          {tripled.map((item, i) => (
            <span
              key={i}
              className="inline-block font-heading text-4xl md:text-5xl font-extrabold uppercase tracking-widest text-foreground/[0.07] shrink-0 select-none"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
