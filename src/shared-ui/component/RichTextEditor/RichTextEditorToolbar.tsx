// Files: src/shared-ui/component/RichTextEditor/RichTextEditorToolbar.tsx
"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
} from "lucide-react";
import clsx from "clsx";

interface RichTextEditorToolbarProps {
  editor: Editor | null;
  disabled?: boolean;
}

export function RichTextEditorToolbar({ editor, disabled }: RichTextEditorToolbarProps) {
  if (!editor) return null;

  const btnClass = (isActive: boolean) =>
    clsx(
      "p-1.5 rounded transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500",
      isActive && "bg-slate-200 text-indigo-700 font-semibold",
      disabled && "opacity-40 pointer-events-none",
    );

  return (
    <div
      role="toolbar"
      aria-label="Editor Formatting Options"
      className="flex flex-wrap items-center gap-1 p-1.5 border-b border-slate-200 bg-slate-50/80 rounded-t-lg"
    >
      <button
        type="button"
        title="Tebal (Ctrl+B)"
        aria-label="Format Tebal"
        aria-pressed={editor.isActive("bold")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Miring (Ctrl+I)"
        aria-label="Format Miring"
        aria-pressed={editor.isActive("italic")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Coretan (Ctrl+Shift+X)"
        aria-label="Format Coret"
        aria-pressed={editor.isActive("strike")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(editor.isActive("strike"))}
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-slate-200 mx-1" />

      <button
        type="button"
        title="Heading 2"
        aria-label="Heading 2"
        aria-pressed={editor.isActive("heading", { level: 2 })}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive("heading", { level: 2 }))}
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Heading 3"
        aria-label="Heading 3"
        aria-pressed={editor.isActive("heading", { level: 3 })}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive("heading", { level: 3 }))}
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-slate-200 mx-1" />

      <button
        type="button"
        title="Daftar Poin"
        aria-label="Daftar Poin"
        aria-pressed={editor.isActive("bulletList")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
      >
        <List className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Daftar Angka"
        aria-label="Daftar Angka"
        aria-pressed={editor.isActive("orderedList")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive("orderedList"))}
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Kutipan"
        aria-label="Kutipan"
        aria-pressed={editor.isActive("blockquote")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-slate-200 mx-1" />

      <button
        type="button"
        title="Hapus Pemformatan"
        aria-label="Hapus Pemformatan"
        disabled={disabled}
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        className={btnClass(false)}
      >
        <RemoveFormatting className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-slate-200 mx-1" />

      <button
        type="button"
        title="Urungkan (Ctrl+Z)"
        aria-label="Urungkan"
        disabled={disabled || !editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
        className={btnClass(false)}
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Ulangi (Ctrl+Y)"
        aria-label="Ulangi"
        disabled={disabled || !editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
        className={btnClass(false)}
      >
        <RotateCw className="w-4 h-4" />
      </button>
    </div>
  );
}
