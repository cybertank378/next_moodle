// File: src/shared-ui/component/Card.tsx

import type React from "react";

interface Props {
  children: React.ReactNode;

  className?: string;
}

export default function Card({ children, className }: Props) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-200/60
        dark:border-slate-800/60
        bg-white/80
        dark:bg-slate-900/60
        text-slate-800
        dark:text-slate-200
        shadow-lg
        shadow-slate-200/40
        dark:shadow-none
        backdrop-blur-xl
        p-6
        transition-all
        duration-300
        ${className ?? ""}
      `}
    >
      {children}
    </div>
  );
}
