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
});
