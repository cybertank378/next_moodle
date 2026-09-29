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
        rounded-xl
        border
        border-slate-200
        dark:border-slate-800
        bg-white
        dark:bg-[#151521]
        text-slate-800
        dark:text-slate-200
        shadow-sm
        p-6
        transition-colors
        duration-200
        ${className ?? ""}
      `}
    >
      {children}
    </div>
  );
}
