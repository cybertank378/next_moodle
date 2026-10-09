export const APP_NAME = "Aksaventra";

export const APP_DESCRIPTION =
  "Platform pembelajaran dan ujian berbasis Moodle untuk sekolah.";

export type BrandSurfaceTone = "light" | "dark";
export type BrandLogoVariant = "horizontal" | "mark";

export const BRAND_ASSETS = {
  horizontal: {
    light: "/assets/images/logo/aksaventra-logo-on-light.svg",
    dark: "/assets/images/logo/aksaventra-logo-on-dark.svg",
  },
  mark: {
    light: "/assets/images/logo/aksaventra-mark-on-light.svg",
    dark: "/assets/images/logo/aksaventra-mark-on-dark.svg",
  },
} as const satisfies Record<BrandLogoVariant, Record<BrandSurfaceTone, string>>;

interface GetBrandAssetOptions {
  readonly surfaceTone: BrandSurfaceTone;
  readonly variant: BrandLogoVariant;
}

export function getBrandAsset({
  surfaceTone,
  variant,
}: GetBrandAssetOptions): string {
  return BRAND_ASSETS[variant][surfaceTone];
}
