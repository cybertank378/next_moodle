// Files: src/sections/auth/atoms/AuthBrand.tsx

import clsx from "clsx";
import Image from "next/image";

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
  const logoSrc = isLight
    ? "/assets/images/logo/logo-dark.png"
    : "/assets/images/logo/logo-light.png";

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
      <Image
        alt="Aksaventra Sistem Pembelajaran"
        className={clsx(sizeClasses, "object-contain")}
        height={60}
        priority
        src={logoSrc}
        width={180}
      />
    </div>
  );
}
