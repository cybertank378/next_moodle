// Files: src/shared-ui/component/RichTextEditor/__tests__/RichTextViewer.test.tsx

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RichTextViewer from "@/shared-ui/component/RichTextEditor/RichTextViewer";

describe("RichTextViewer", () => {
  it("renders safe HTML string correctly", () => {
    const html = renderToStaticMarkup(
      <RichTextViewer content="<p>Pengumuman penting</p>" />,
    );
    expect(html).toContain("Pengumuman penting");
  });

  it("renders JSON content safely through renderer", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Konten dari dokumen Tiptap" }],
        },
      ],
    };

    const html = renderToStaticMarkup(<RichTextViewer content={json} />);
    expect(html).toContain("Konten dari dokumen Tiptap");
  });

  it("renders inline math equation from JSON content", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Nilai dari " },
            { type: "inlineMath", attrs: { latex: "\\frac{1}{2}" } },
            { type: "text", text: " adalah setengah." },
          ],
        },
      ],
    };

    const html = renderToStaticMarkup(<RichTextViewer content={json} />);
    expect(html).toContain("math-inline");
    expect(html).toContain('data-type="inline-math"');
    expect(html).toContain("katex");
    expect(html).toContain("Nilai dari");
  });

  it("renders block math equation from JSON content", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "blockMath",
          attrs: { latex: "x^2 + y^2 = z^2" },
        },
      ],
    };

    const html = renderToStaticMarkup(<RichTextViewer content={json} />);
    expect(html).toContain("math-block");
    expect(html).toContain('data-type="block-math"');
    expect(html).toContain("overflow-x-auto");
    expect(html).toContain("katex");
  });

  it("renders math markers from raw HTML string and sanitizes scripts", () => {
    const rawHtml =
      '<p>Hitung <span data-type="inline-math" data-latex="\\sqrt{16}"></span> sekarang.</p>' +
      '<div data-type="block-math" data-latex="E = mc^2"></div>' +
      '<script>alert("xss")</script><img src="x" onerror="alert(1)" />';

    const html = renderToStaticMarkup(<RichTextViewer content={rawHtml} />);
    expect(html).toContain("math-inline");
    expect(html).toContain("math-block");
    expect(html).toContain("katex");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("alert(");
  });

  it("handles tolerant invalid LaTeX without crashing", () => {
    const json = {
      type: "doc",
      content: [
        {
          type: "inlineMath",
          attrs: { latex: "\\frac{incomplete" },
        },
      ],
    };

    const html = renderToStaticMarkup(<RichTextViewer content={json} />);
    expect(html).toContain("katex-error");
  });
});
