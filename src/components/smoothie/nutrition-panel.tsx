import { MacroRing } from "./macro-ring";

interface NutritionPanelProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  targets?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  size?: "sm" | "md";
}

export function NutritionPanel({
  calories,
  protein,
  carbs,
  fat,
  fiber,
  sugar,
  targets,
  size = "md",
}: NutritionPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-around">
        <MacroRing
          label="Calories"
          value={calories}
          unit="kcal"
          percentage={targets?.calories ? (calories / targets.calories) * 100 : 100}
          color="text-foreground"
          size={size}
        />
        <MacroRing
          label="Protein"
          value={protein}
          unit="g"
          percentage={targets?.protein ? (protein / targets.protein) * 100 : 100}
          color="text-primary"
          size={size}
        />
        <MacroRing
          label="Carbs"
          value={carbs}
          unit="g"
          percentage={targets?.carbs ? (carbs / targets.carbs) * 100 : 100}
          color="text-primary"
          size={size}
        />
        <MacroRing
          label="Fat"
          value={fat}
          unit="g"
          percentage={targets?.fat ? (fat / targets.fat) * 100 : 100}
          color="text-amber-500"
          size={size}
        />
      </div>
      {(fiber !== undefined || sugar !== undefined) && size === "md" && (
        <div className="flex justify-center gap-6 text-xs text-muted-foreground">
          {fiber !== undefined && <span>Fiber: {Math.round(fiber)}g</span>}
          {sugar !== undefined && <span>Sugar: {Math.round(sugar)}g</span>}
        </div>
      )}
    </div>
  );
}
