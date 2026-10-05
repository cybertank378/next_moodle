// Files: src/shared-ui/component/RichTextEditor/__tests__/RichTextViewer.test.tsx

import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import RichTextViewer from "@/shared-ui/component/RichTextEditor/RichTextViewer";

describe("RichTextViewer", () => {
  it("renders safe HTML string correctly", () => {
    const html = renderToStaticMarkup(<RichTextViewer content="<p>Pengumuman penting</p>" />);
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
});
