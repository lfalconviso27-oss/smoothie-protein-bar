"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  { status: "confirmed", label: "Confirmed", icon: "✓" },
  { status: "preparing", label: "Preparing", icon: "🍌" },
  { status: "ready", label: "Ready", icon: "🥤" },
  { status: "picked_up", label: "Picked Up", icon: "🎉" },
] as const;

interface OrderStatusTrackerProps {
  currentStatus: string;
}

export function OrderStatusTracker({ currentStatus }: OrderStatusTrackerProps) {
  const currentIndex = STEPS.findIndex((s) => s.status === currentStatus);

  return (
    <div className="flex items-center justify-between px-2">
      {STEPS.map((step, i) => {
        const isCompleted = i <= currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step.status} className="flex flex-col items-center gap-2 relative">
            {i > 0 && (
              <div
                className={cn(
                  "absolute top-5 h-0.5 transition-colors duration-500",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
                style={{ width: "calc(100% + 20px)", left: "-60%" }}
              />
            )}
            <motion.div
              initial={false}
              animate={{
                scale: isCurrent ? [1, 1.1, 1] : 1,
                boxShadow: isCurrent
                  ? "0 0 20px rgba(142,122,181,0.3), 0 0 40px rgba(142,122,181,0.15)"
                  : "0 0 0px transparent",
              }}
              transition={{
                scale: {
                  duration: 1.5,
                  repeat: isCurrent ? Infinity : 0,
                  ease: "easeInOut",
                },
                boxShadow: { duration: 0.4 },
              }}
              className={cn(
                "relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-lg transition-colors duration-500",
                isCompleted
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground",
                isCurrent && "ring-4 ring-primary/30"
              )}
            >
              {step.icon}
            </motion.div>
            <span
              className={cn(
                "text-xs font-medium transition-colors duration-500",
                isCompleted ? "text-primary" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
