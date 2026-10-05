// Files: src/shared-ui/component/RichTextEditor/RichTextEditor.tsx
"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import clsx from "clsx";
import { RichTextEditorToolbar } from "@/shared-ui/component/RichTextEditor/RichTextEditorToolbar";
import { getRichTextEditorExtensions } from "@/shared-ui/component/RichTextEditor/richTextEditorExtensions";
import type { RichTextEditorProps } from "@/shared-ui/component/RichTextEditor/RichTextEditorTypes";

export default function RichTextEditor({
  value,
  onChange,
  disabled = false,
  readOnly = false,
  placeholder = "Tulis isi pengumuman atau konten di sini...",
  className,
  ariaLabel = "Konten Teks",
  minHeight = "180px",
}: RichTextEditorProps) {
  const isUpdatingRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: getRichTextEditorExtensions(),
    content: value || { type: "doc", content: [] },
    editable: !disabled && !readOnly,
    editorProps: {
      attributes: {
        class: clsx(
          "prose prose-sm sm:prose max-w-none px-4 py-3 focus:outline-none text-slate-800",
          disabled && "bg-slate-50 text-slate-400 cursor-not-allowed",
        ),
        "aria-label": ariaLabel,
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => {
      if (isUpdatingRef.current) return;
      if (onChange) {
        const json = editor.getJSON();
        const text = editor.getText();
        const html = editor.getHTML();
        onChange({ json, text, html });
      }
    },
  });

  // Sync external value changes without resetting cursor position
  useEffect(() => {
    if (!editor || !value) return;

    const currentJSON = JSON.stringify(editor.getJSON());
    const incomingJSON = typeof value === "string" ? value : JSON.stringify(value);

    if (currentJSON !== incomingJSON) {
      isUpdatingRef.current = true;
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        editor.commands.setContent(parsed, { emitUpdate: false });
      } catch {
        // Fallback for raw string
        editor.commands.setContent(value, { emitUpdate: false });
      } finally {
        isUpdatingRef.current = false;
      }
    }
  }, [editor, value]);

  // Update editable state when disabled or readOnly changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled && !readOnly);
    }
  }, [editor, disabled, readOnly]);

  return (
    <div
      className={clsx(
        "flex flex-col border border-slate-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all",
        disabled && "opacity-60 bg-slate-50",
        className,
      )}
    >
      {!readOnly && <RichTextEditorToolbar editor={editor} disabled={disabled} />}
      <div className="relative flex-1">
        {editor && editor.isEmpty && !disabled && (
          <div className="absolute top-3 left-4 text-slate-400 pointer-events-none text-sm select-none">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
