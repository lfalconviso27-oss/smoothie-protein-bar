import { cn } from "@/lib/utils";

interface NutritionTagProps {
  label: string;
  value?: string | number;
  variant?: "primary" | "muted";
  className?: string;
}

export function NutritionTag({
  label,
  value,
  variant = "primary",
  className,
}: NutritionTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "primary" && "bg-primary/10 text-primary",
        variant === "muted" && "bg-secondary text-muted-foreground",
        className
      )}
    >
      {value && <span className="font-bold">{value}</span>}
      {label}
    </span>
  );
}
