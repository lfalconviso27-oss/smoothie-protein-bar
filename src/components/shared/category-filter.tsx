"use client";

import { cn } from "@/lib/utils";

interface Category {
  slug: string;
  name: string;
  icon?: string | null;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
  showAll?: boolean;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
  showAll = true,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      {showAll && (
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all",
            selected === null
              ? "bg-primary text-white shadow-soft"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          All
        </button>
      )}
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onSelect(cat.slug === selected ? null : cat.slug)}
          className={cn(
            "shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
            selected === cat.slug
              ? "bg-primary text-white shadow-soft"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          {cat.icon && <span>{cat.icon}</span>}
          {cat.name}
        </button>
      ))}
    </div>
  );
}
