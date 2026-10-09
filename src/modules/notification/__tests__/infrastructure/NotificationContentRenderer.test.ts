// Files: src/modules/notification/__tests__/infrastructure/NotificationContentRenderer.test.ts

import { describe, expect, it } from "vitest";
import { NotificationContentRenderer } from "@/modules/notification/infrastructure/providers/NotificationContentRenderer";

describe("NotificationContentRenderer", () => {
  const renderer = new NotificationContentRenderer();

  it("renders paragraph with bold and italic text safely", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Halo " },
            { type: "text", marks: [{ type: "bold" }], text: "semua" },
            { type: "text", text: " dan " },
            { type: "text", marks: [{ type: "italic" }], text: "guru" },
          ],
        },
      ],
    };

    const html = renderer.renderToSanitizedHtml(json);
    expect(html).toContain("<p");
    expect(html).toContain("<strong>semua</strong>");
    expect(html).toContain("<em>guru</em>");
  });

  it("sanitizes javascript: links to #", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
              text: "Klik disini",
            },
          ],
        },
      ],
    };

    const html = renderer.renderToSanitizedHtml(json);
    expect(html).not.toContain("javascript:");
    expect(html).toContain('href="#"');
  });

  it("escapes raw HTML tags to prevent XSS injection", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "<script>alert('xss')</script>" }],
        },
      ],
    };

    const html = renderer.renderToSanitizedHtml(json);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("extracts plain text accurately", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Judul Pengumuman" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Isi pengumuman penting." }],
        },
      ],
    };

    const text = renderer.extractPlainText(json);
    expect(text).toBe("Judul Pengumuman Isi pengumuman penting.");
  });

  it("renders inlineMath and blockMath nodes with KaTeX", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Persamaan " },
            { type: "inlineMath", attrs: { latex: "a^2 + b^2 = c^2" } },
          ],
        },
        {
          type: "blockMath",
          attrs: { latex: "\\int_0^1 x dx" },
        },
      ],
    };

    const html = renderer.renderToSanitizedHtml(json);
    expect(html).toContain('data-type="inline-math"');
    expect(html).toContain('data-type="block-math"');
    expect(html).toContain("katex");
    expect(html).toContain("overflow-x-auto");
  });

  it("extracts plain text from math nodes so equation-only content is not empty", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "blockMath",
          attrs: { latex: "\\sum_{i=1}^n x_i = 100" },
        },
      ],
    };

    const text = renderer.extractPlainText(json);
    expect(text).toBe("\\sum_{i=1}^n x_i = 100");
    expect(text.length).toBeGreaterThan(0);
  });

  it("renderHtmlWithMath parses math markers and sanitizes malicious tags", () => {
    const rawHtml =
      '<p>Hitung <span data-type="inline-math" data-latex="\\sqrt{4}"></span></p>' +
      '<div data-type="block-math" data-latex="x = 2"></div>' +
      '<script>alert(1)</script><a href="javascript:alert(2)">klik</a>';

    const result = renderer.renderHtmlWithMath(rawHtml);
    expect(result).toContain("math-inline");
    expect(result).toContain("math-block");
    expect(result).toContain("katex");
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("javascript:");
    expect(result).toContain('href="#"');
  });
});
