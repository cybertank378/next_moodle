// Files: src/shared-ui/component/RichTextEditor/richTextEditorExtensions.ts

import StarterKit from "@tiptap/starter-kit";

export function getRichTextEditorExtensions() {
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
  ];
}
