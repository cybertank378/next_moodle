// Files: src/sections/auth/atoms/AuthBrand.tsx

import clsx from "clsx";
import { APP_NAME, type BrandSurfaceTone } from "@/libs/branding";
import BrandLogo from "@/shared-ui/component/BrandLogo";

export interface AuthBrandProps {
  readonly surfaceTone?: BrandSurfaceTone;
  readonly size?: "sm" | "md" | "lg";
  readonly className?: string;
  readonly preload?: boolean;
}

export default function AuthBrand({
  surfaceTone = "light",
  size = "md",
  className,
  preload = false,
}: AuthBrandProps) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-10 w-auto",
    lg: "h-12 w-auto",
  }[size];

  return (
    <div
      className={clsx(
        "flex items-center gap-3 select-none transition-transform hover:opacity-95",
        className,
      )}
    >
      <BrandLogo
        accessibleName={`${APP_NAME} Sistem Pembelajaran`}
        className={sizeClasses}
        preload={preload}
        surfaceTone={surfaceTone}
      />
    </div>
  );
}
