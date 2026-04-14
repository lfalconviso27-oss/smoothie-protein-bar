"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedHeroWordProps {
  words: string[];
  className?: string;
}

export function AnimatedHeroWord({ words, className }: AnimatedHeroWordProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2200);
    return () => clearTimeout(id);
  }, [index, words.length]);

  return (
    <span
      className={`relative inline-flex w-full justify-center overflow-hidden ${className ?? ""}`}
      style={{ minHeight: "1.2em" }}
    >
      &nbsp;
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="absolute font-bold text-primary"
          initial={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
          animate={
            index === i
              ? { y: 0, opacity: 1 }
              : { y: index > i ? "-100%" : "100%", opacity: 0 }
          }
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
