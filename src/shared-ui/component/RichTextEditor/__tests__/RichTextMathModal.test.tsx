// Files: src/shared-ui/component/RichTextEditor/__tests__/RichTextMathModal.test.tsx

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RichTextMathModal from "@/shared-ui/component/RichTextEditor/RichTextMathModal";

describe("RichTextMathModal", () => {
  it("renders modal structure when open", () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    const html = renderToStaticMarkup(
      <RichTextMathModal
        open={true}
        onClose={handleClose}
        onSave={handleSave}
        initialType="inline"
        initialLatex="\\frac{1}{2}"
      />,
    );

    expect(html).toContain("Sisipkan Rumus Matematika");
    expect(html).toContain("Inline (Dalam Kalimat)");
    expect(html).toContain("Block (Baris Terpisah)");
    expect(html).toContain("Contoh Rumus Cepat");
    expect(html).toContain("Pecahan");
    expect(html).toContain("katex");
    expect(html).toContain("Simpan");
    expect(html).toContain("Batal");
  });

  it("renders in editing mode with delete button when onDelete provided", () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();
    const handleDelete = vi.fn();

    const html = renderToStaticMarkup(
      <RichTextMathModal
        open={true}
        onClose={handleClose}
        onSave={handleSave}
        onDelete={handleDelete}
        initialType="block"
        initialLatex="x^2 + y^2 = z^2"
        isEditing={true}
      />,
    );

    expect(html).toContain("Edit Rumus Matematika");
    expect(html).toContain("Hapus");
  });

  it("does not render markup when open is false", () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    const html = renderToStaticMarkup(
      <RichTextMathModal
        open={false}
        onClose={handleClose}
        onSave={handleSave}
      />,
    );

    expect(html).toBe("");
  });
});
