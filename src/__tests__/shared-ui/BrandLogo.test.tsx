import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";
import { APP_NAME, BRAND_ASSETS, getBrandAsset } from "@/libs/branding";
import BrandLogo from "@/shared-ui/component/BrandLogo";

describe("Aksaventra branding", () => {
  it("keeps the platform name and asset paths in one configuration", () => {
    expect(APP_NAME).toBe("Aksaventra");
    expect(BRAND_ASSETS.horizontal.light).toContain("logo-on-light.svg");
    expect(BRAND_ASSETS.horizontal.dark).toContain("logo-on-dark.svg");
    expect(BRAND_ASSETS.mark.light).toContain("mark-on-light.svg");
    expect(BRAND_ASSETS.mark.dark).toContain("mark-on-dark.svg");
  });

  it("uses the platform branding in install metadata", () => {
    const metadata = manifest();

    expect(metadata.name).toBe(APP_NAME);
    expect(metadata.short_name).toBe(APP_NAME);
    expect(metadata.icons).toHaveLength(2);
  });

  it.each([
    ["horizontal", "light", "logo-on-light.svg"],
    ["horizontal", "dark", "logo-on-dark.svg"],
    ["mark", "light", "mark-on-light.svg"],
    ["mark", "dark", "mark-on-dark.svg"],
  ] as const)(
    "selects the %s asset from the %s surface rather than app theme",
    (variant, surfaceTone, expectedAsset) => {
      expect(getBrandAsset({ surfaceTone, variant })).toContain(expectedAsset);
    },
  );

  it("renders one accessible platform name for a standalone logo", () => {
    const html = renderToStaticMarkup(
      <BrandLogo surfaceTone="light" variant="horizontal" />,
    );

    expect(html).toContain("logo-on-light.svg");
    expect(html.match(/Aksaventra/g)).toHaveLength(1);
  });

  it("renders a decorative mark without duplicating a parent link name", () => {
    const html = renderToStaticMarkup(
      <a aria-label={APP_NAME} href="/dashboard">
        <BrandLogo decorative surfaceTone="dark" variant="mark" />
      </a>,
    );

    expect(html).toContain("mark-on-dark.svg");
    expect(html.match(/Aksaventra/g)).toHaveLength(1);
    expect(html).toContain('alt=""');
  });
});
