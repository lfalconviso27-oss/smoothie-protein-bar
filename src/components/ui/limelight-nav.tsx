"use client";

import React, { useState, useRef, useLayoutEffect } from "react";

type NavItem = {
  id: string | number;
  icon: React.ReactElement;
  label?: string;
  onClick?: () => void;
};

type LimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

export type { NavItem };

export const LimelightNav = ({
  items = [],
  defaultActiveIndex = 0,
  activeIndex: controlledIndex,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
}: LimelightNavProps) => {
  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = controlledIndex ?? internalIndex;

  useLayoutEffect(() => {
    if (items.length === 0) return;
    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];
    if (limelight && activeItem) {
      const newLeft =
        activeItem.offsetLeft +
        activeItem.offsetWidth / 2 -
        limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;
      if (!isReady) setTimeout(() => setIsReady(true), 50);
    }
  }, [activeIndex, isReady, items]);

  if (items.length === 0) return null;

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setInternalIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav
      className={`relative inline-flex items-center h-16 rounded-2xl bg-white border border-border px-2 shadow-soft ${className ?? ""}`}
    >
      {items.map(({ id, icon, label, onClick }, index) => (
        <button
          key={id}
          ref={(el) => { navItemRefs.current[index] = el; }}
          className={`relative z-20 flex h-full flex-col cursor-pointer items-center justify-center gap-0.5 px-4 py-1 ${iconContainerClassName ?? ""}`}
          onClick={() => handleItemClick(index, onClick)}
          aria-label={label}
        >
          {React.cloneElement(icon, {
            className: `w-5 h-5 transition-all duration-200 ${
              activeIndex === index
                ? "text-primary opacity-100 scale-110"
                : "text-muted-foreground opacity-50"
            } ${iconClassName ?? ""}`,
          } as React.HTMLAttributes<SVGElement>)}
          {label && (
            <span
              className={`text-[10px] font-semibold transition-colors duration-200 ${
                activeIndex === index ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          )}
        </button>
      ))}

      <div
        ref={limelightRef}
        className={`absolute top-0 z-10 w-10 h-[3px] rounded-full bg-primary ${
          isReady ? "transition-[left] duration-300 ease-out" : ""
        } ${limelightClassName ?? ""}`}
        style={{ left: "-999px" }}
      >
        <div className="absolute left-[-40%] top-[3px] w-[180%] h-12 [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)] bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
      </div>
    </nav>
  );
};
