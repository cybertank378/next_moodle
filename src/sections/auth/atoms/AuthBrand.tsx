// Files: src/sections/auth/atoms/AuthBrand.tsx

import clsx from "clsx";

export interface AuthBrandProps {
  readonly variant?: "light" | "dark";
  readonly size?: "sm" | "md" | "lg";
  readonly className?: string;
}

export default function AuthBrand({
  variant = "dark",
  size = "md",
  className,
}: AuthBrandProps) {
  const isLight = variant === "light";

  const sizeClasses = {
    sm: {
      icon: "w-8 h-8",
      title: "text-lg",
      subtitle: "text-[11px]",
    },
    md: {
      icon: "w-10 h-10",
      title: "text-xl",
      subtitle: "text-xs",
    },
    lg: {
      icon: "w-12 h-12",
      title: "text-2xl",
      subtitle: "text-xs",
    },
  }[size];

  return (
    <div className={clsx("flex items-center gap-3 select-none", className)}>
      <div
        className={clsx(
          sizeClasses.icon,
          "relative flex items-center justify-center rounded-xl p-2 shadow-sm transition-transform hover:scale-105",
          isLight
            ? "bg-gradient-to-br from-blue-500/20 to-sky-400/20 border border-blue-400/30 text-white backdrop-blur-md"
            : "bg-blue-600 text-white dark:bg-blue-500",
        )}
      >
        {/* Book open E-shaped stylized educational SVG logo */}
        <svg
          aria-hidden="true"
          className="h-full w-full"
          fill="none"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Spine / Vertical Stem of E */}
          <path
            d="M6 7C6 5.89543 6.89543 5 8 5H10C11.1046 5 12 5.89543 12 7V25C12 26.1046 11.1046 27 10 27H8C6.89543 27 6 26.1046 6 25V7Z"
            fill="currentColor"
          />
          {/* Top Bar / Upper Book Leaf */}
          <path
            d="M12 7C12 5.89543 12.8954 5 14 5H24.5C25.3284 5 26 5.67157 26 6.5C26 7.32843 25.3284 8 24.5 8H14C12.8954 8 12 7.10457 12 6V7Z"
            fill={isLight ? "#93C5FD" : "#DBEAFE"}
          />
          <path
            d="M12 9H23C24.1046 9 25 9.89543 25 11C25 12.1046 24.1046 13 23 13H12V9Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          {/* Middle Bar / Center Bookmark */}
          <path
            d="M12 15H21C21.8284 15 22.5 15.6716 22.5 16.5C22.5 17.3284 21.8284 18 21 18H12V15Z"
            fill={isLight ? "#60A5FA" : "#BFDBFE"}
          />
          {/* Bottom Bar / Lower Book Leaf */}
          <path
            d="M12 20H24C25.1046 20 26 20.8954 26 22C26 23.1046 25.1046 24 24 24H14C12.8954 24 12 23.1046 12 22V20Z"
            fill="currentColor"
            fillOpacity="0.95"
          />
          {/* Subtle page fold curve */}
          <circle
            cx="23.5"
            cy="16.5"
            fill={isLight ? "#38BDF8" : "#93C5FD"}
            r="1.5"
          />
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <span
          className={clsx(
            sizeClasses.title,
            "font-bold tracking-tight leading-none",
            isLight ? "text-white" : "text-slate-900 dark:text-white",
          )}
        >
          EduNusa
        </span>
        <span
          className={clsx(
            sizeClasses.subtitle,
            "font-medium mt-1 leading-none tracking-normal",
            isLight ? "text-slate-300" : "text-slate-500 dark:text-slate-400",
          )}
        >
          Sistem Pembelajaran
        </span>
      </div>
    </div>
  );
}
