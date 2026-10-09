// Files: src/shared-ui/component/RichTextEditor/__tests__/RichTextEditor.test.tsx

import type { Editor } from "@tiptap/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RichTextEditor from "@/shared-ui/component/RichTextEditor/RichTextEditor";
import { RichTextEditorToolbar } from "@/shared-ui/component/RichTextEditor/RichTextEditorToolbar";

const createMockEditor = () => {
  return {
    isActive: vi.fn(() => false),
    can: vi.fn(() => ({
      undo: () => true,
      redo: () => true,
    })),
    chain: vi.fn(() => ({
      focus: () => ({
        toggleBold: () => ({ run: vi.fn() }),
        toggleItalic: () => ({ run: vi.fn() }),
        toggleStrike: () => ({ run: vi.fn() }),
        toggleHeading: () => ({ run: vi.fn() }),
        toggleBulletList: () => ({ run: vi.fn() }),
        toggleOrderedList: () => ({ run: vi.fn() }),
        toggleBlockquote: () => ({ run: vi.fn() }),
        unsetAllMarks: () => ({ clearNodes: () => ({ run: vi.fn() }) }),
        undo: () => ({ run: vi.fn() }),
        redo: () => ({ run: vi.fn() }),
      }),
    })),
  } as unknown as Editor;
};

describe("RichTextEditor", () => {
  it("renders container structure and editor content wrapper", () => {
    const html = renderToStaticMarkup(
      <RichTextEditor value="<p>Halo dunia</p>" onChange={vi.fn()} />,
    );

    expect(html).toContain("border-slate-200");
    expect(html).toContain("relative flex-1");
  });

  it("applies disabled classes when disabled is true", () => {
    const html = renderToStaticMarkup(
      <RichTextEditor value="<p>Editor non-aktif</p>" disabled={true} />,
    );

    expect(html).toContain("opacity-60");
    expect(html).toContain("bg-slate-50");
  });

  it("renders initial document with inline and block math nodes without crashing", () => {
    const jsonDoc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Persamaan " },
            { type: "inlineMath", attrs: { latex: "x^2 + y^2 = 1" } },
          ],
        },
        {
          type: "blockMath",
          attrs: { latex: "\\int_0^\\infty e^{-x} dx" },
        },
      ],
    };

    const html = renderToStaticMarkup(
      <RichTextEditor value={jsonDoc} onChange={vi.fn()} />,
    );

    expect(html).toContain("relative flex-1");
  });
});

describe("RichTextEditorToolbar", () => {
  it("renders toolbar with math equation button by default", () => {
    const mockEditor = createMockEditor();
    const handleOpenMath = vi.fn();

    const html = renderToStaticMarkup(
      <RichTextEditorToolbar
        editor={mockEditor}
        onOpenMathModal={handleOpenMath}
      />,
    );

    expect(html).toContain('data-testid="toolbar-math-btn"');
    expect(html).toContain("Rumus Matematika (LaTeX)");
  });

  it("disables math button when disabled is true", () => {
    const mockEditor = createMockEditor();

    const html = renderToStaticMarkup(
      <RichTextEditorToolbar editor={mockEditor} disabled={true} />,
    );

    expect(html).toContain('data-testid="toolbar-math-btn"');
    expect(html).toContain("disabled");
  });

  it("returns null when editor is null", () => {
    const html = renderToStaticMarkup(<RichTextEditorToolbar editor={null} />);

    expect(html).toBe("");
  });
});
