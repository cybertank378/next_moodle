import clsx from "clsx";
import Image from "next/image";
import {
  APP_NAME,
  type BrandLogoVariant,
  type BrandSurfaceTone,
  getBrandAsset,
} from "@/libs/branding";

export interface BrandLogoProps {
  readonly surfaceTone: BrandSurfaceTone;
  readonly variant?: BrandLogoVariant;
  readonly accessibleName?: string;
  readonly className?: string;
  readonly decorative?: boolean;
  readonly preload?: boolean;
  readonly src?: string;
}

const DIMENSIONS: Record<
  BrandLogoVariant,
  { readonly height: number; readonly width: number }
> = {
  horizontal: { height: 72, width: 300 },
  mark: { height: 64, width: 64 },
};

export default function BrandLogo({
  surfaceTone,
  variant = "horizontal",
  accessibleName = APP_NAME,
  className,
  decorative = false,
  preload = false,
  src,
}: BrandLogoProps) {
  const dimensions = DIMENSIONS[variant];

  return (
    <Image
      alt={decorative ? "" : accessibleName}
      aria-hidden={decorative || undefined}
      className={clsx("object-contain", className)}
      height={dimensions.height}
      preload={preload}
      src={src ?? getBrandAsset({ surfaceTone, variant })}
      unoptimized
      width={dimensions.width}
    />
  );
}
