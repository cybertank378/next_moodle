import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ThemeSwitch from "@/shared-ui/component/ThemeSwitch";

describe("ThemeSwitch Component", () => {
  it("renders with role switch and default attributes", () => {
    const html = renderToStaticMarkup(<ThemeSwitch />);
    expect(html).toContain('role="switch"');
    expect(html).toContain("Ubah tema terang atau gelap");
  });

  it("renders light mode elements when checked is false", () => {
    const html = renderToStaticMarkup(<ThemeSwitch checked={false} />);
    expect(html).toContain('aria-checked="false"');
    expect(html).toContain("Beralih ke Mode Gelap");
    expect(html).toContain("Awan Mode Terang");
  });

  it("renders dark mode elements when checked is true", () => {
    const html = renderToStaticMarkup(<ThemeSwitch checked={true} />);
    expect(html).toContain('aria-checked="true"');
    expect(html).toContain("Beralih ke Mode Terang");
    expect(html).toContain("Bintang Mode Gelap");
  });
});
