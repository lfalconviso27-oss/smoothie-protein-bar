import { cn } from "@/lib/utils";

interface MacroRingProps {
  label: string;
  value: number;
  unit: string;
  percentage?: number;
  color: string;
  size?: "sm" | "md";
}

export function MacroRing({
  label,
  value,
  unit,
  percentage = 100,
  color,
  size = "md",
}: MacroRingProps) {
  const dims = size === "sm" ? { w: 56, r: 22, stroke: 4 } : { w: 72, r: 28, stroke: 5 };
  const circumference = 2 * Math.PI * dims.r;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dims.w, height: dims.w }}>
        <svg
          className="-rotate-90"
          width={dims.w}
          height={dims.w}
          viewBox={`0 0 ${dims.w} ${dims.w}`}
        >
          <circle
            cx={dims.w / 2}
            cy={dims.w / 2}
            r={dims.r}
            fill="none"
            stroke="currentColor"
            strokeWidth={dims.stroke}
            className="text-secondary"
          />
          <circle
            cx={dims.w / 2}
            cy={dims.w / 2}
            r={dims.r}
            fill="none"
            stroke="currentColor"
            strokeWidth={dims.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-500", color)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold leading-none", size === "sm" ? "text-xs" : "text-sm")}>
            {Math.round(value)}
          </span>
          <span className="text-[10px] text-muted-foreground">{unit}</span>
        </div>
      </div>
      <span className={cn("text-muted-foreground", size === "sm" ? "text-[10px]" : "text-xs")}>
        {label}
      </span>
    </div>
  );
}
