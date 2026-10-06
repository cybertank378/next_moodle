// Files: src/sections/auth/atoms/AuthFeatureIcon.tsx

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

export interface AuthFeatureIconProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly className?: string;
}

export default function AuthFeatureIcon({
  icon: Icon,
  title,
  description,
  className,
}: AuthFeatureIconProps) {
  return (
    <div
      className={clsx(
        "flex items-start gap-3 select-none text-left",
        className,
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/20 text-blue-200 shadow-xs">
        <Icon aria-hidden="true" size={18} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white leading-snug">
          {title}
        </span>
        <span className="text-xs text-blue-200/70 leading-relaxed mt-0.5">
          {description}
        </span>
      </div>
    </div>
  );
}
