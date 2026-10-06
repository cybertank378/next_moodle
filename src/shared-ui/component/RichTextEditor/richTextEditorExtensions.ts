// Files: src/shared-ui/component/RichTextEditor/richTextEditorExtensions.ts

import { Mathematics } from "@tiptap/extension-mathematics";
import StarterKit from "@tiptap/starter-kit";

export type MathType = "inline" | "block";

export interface RichTextEditorExtensionsOptions {
  onMathClick?: (type: MathType, latex: string, pos: number) => void;
}

export function getRichTextEditorExtensions(
  options?: RichTextEditorExtensionsOptions,
) {
  return [
    StarterKit.configure({
      heading: {
        levels: [2, 3],
      },
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
    Mathematics.configure({
      katexOptions: {
        throwOnError: false,
        trust: false,
      },
      inlineOptions: {
        onClick: (node, pos) => {
          if (options?.onMathClick) {
            const latex =
              typeof node.attrs.latex === "string" ? node.attrs.latex : "";
            options.onMathClick("inline", latex, pos);
          }
        },
      },
      blockOptions: {
        onClick: (node, pos) => {
          if (options?.onMathClick) {
            const latex =
              typeof node.attrs.latex === "string" ? node.attrs.latex : "";
            options.onMathClick("block", latex, pos);
          }
        },
      },
    }),
  ];
}
