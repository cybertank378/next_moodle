// Files: src/sections/auth/atoms/AuthFeatureIcon.tsx

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

export interface AuthFeatureIconProps {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly className?: string;
}

export default function AuthFeatureIcon({
  icon: Icon,
  label,
  className,
}: AuthFeatureIconProps) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl",
        "bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15",
        "text-white text-xs sm:text-sm font-medium shadow-sm transition-all duration-200",
        "select-none cursor-default",
        className,
      )}
    >
      <div className="flex items-center justify-center w-5 h-5 rounded-lg bg-blue-500/30 text-blue-300">
        <Icon aria-hidden="true" size={13} />
      </div>
      <span>{label}</span>
    </div>
  );
}
