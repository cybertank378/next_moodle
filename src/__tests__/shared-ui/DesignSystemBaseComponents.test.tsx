import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";

describe("Design System Base Components", () => {
  describe("Typography", () => {
    it("renders default body variant as paragraph", () => {
      const html = renderToStaticMarkup(<Typography>Halo Dunia</Typography>);
      expect(html).toContain("<p");
      expect(html).toContain("text-slate-600 dark:text-slate-300");
      expect(html).toContain("Halo Dunia");
    });

    it("renders h1 variant with h1 tag and title styling", () => {
      const html = renderToStaticMarkup(
        <Typography variant="h1">Dashboard Utama</Typography>,
      );
      expect(html).toContain("<h1");
      expect(html).toContain("text-2xl md:text-3xl font-bold");
      expect(html).toContain("Dashboard Utama");
    });

    it("renders custom element tag when as prop is supplied", () => {
      const html = renderToStaticMarkup(
        <Typography variant="subheading" as="span" className="custom-test">
          Sub judul
        </Typography>,
      );
      expect(html).toContain("<span");
      expect(html).toContain("custom-test");
      expect(html).toContain("Sub judul");
    });
  });

  describe("Button", () => {
    it("renders default primary filled button", () => {
      const html = renderToStaticMarkup(<Button>Simpan</Button>);
      expect(html).toContain("<button");
      expect(html).toContain("bg-indigo-600 dark:bg-indigo-500");
      expect(html).toContain("Simpan");
    });

    it("renders danger variant properly with red styles", () => {
      const html = renderToStaticMarkup(
        <Button variant="danger">Hapus</Button>,
      );
      expect(html).toContain("bg-red-500 text-white");
      expect(html).toContain("Hapus");
    });

    it("renders outline variant with danger color", () => {
      const html = renderToStaticMarkup(
        <Button variant="outline" color="danger">
          Batal
        </Button>,
      );
      expect(html).toContain("border-red-500 text-red-500");
      expect(html).toContain("Batal");
    });

    it("handles loading state by disabling and rendering spinner", () => {
      const html = renderToStaticMarkup(<Button loading>Memuat...</Button>);
      expect(html).toContain("disabled");
      expect(html).toContain("animate-spin");
    });
  });

  describe("Card", () => {
    it("renders with dark and white surface tokens", () => {
      const html = renderToStaticMarkup(
        <Card className="test-card">
          <div>Konten Card</div>
        </Card>,
      );
      expect(html).toContain("bg-white");
      expect(html).toContain("dark:bg-[#151521]");
      expect(html).toContain("border-slate-200");
      expect(html).toContain("dark:border-slate-800");
      expect(html).toContain("Konten Card");
    });
  });
});
