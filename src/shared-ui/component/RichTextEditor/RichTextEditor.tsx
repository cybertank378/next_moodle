// Files: src/shared-ui/component/RichTextEditor/RichTextEditor.tsx
"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { RichTextEditorToolbar } from "@/shared-ui/component/RichTextEditor/RichTextEditorToolbar";
import type { RichTextEditorProps } from "@/shared-ui/component/RichTextEditor/RichTextEditorTypes";
import RichTextMathModal from "@/shared-ui/component/RichTextEditor/RichTextMathModal";
import {
  getRichTextEditorExtensions,
  type MathType,
} from "@/shared-ui/component/RichTextEditor/richTextEditorExtensions";
import { richTextRenderer } from "@/shared-ui/component/RichTextEditor/richTextRenderer";

interface MathModalState {
  open: boolean;
  type: MathType;
  latex: string;
  pos?: number;
  isEditing: boolean;
}

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
  const savedSelectionRef = useRef<number | null>(null);
  const [mathModalState, setMathModalState] = useState<MathModalState | null>(
    null,
  );

  // Math click callback ref for stable extension registration
  const mathClickRef = useRef<
    ((type: MathType, latex: string, pos: number) => void) | undefined
  >(undefined);
  mathClickRef.current = (type, latex, pos) => {
    if (disabled || readOnly) return;
    setMathModalState({
      open: true,
      type,
      latex,
      pos,
      isEditing: true,
    });
  };

  const extensions = useRef(
    getRichTextEditorExtensions({
      onMathClick: (type: MathType, latex: string, pos: number) => {
        mathClickRef.current?.(type, latex, pos);
      },
    }),
  ).current;

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
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
        let text = editor.getText();
        if (!text.trim()) {
          text = richTextRenderer.extractPlainText(json);
        }
        const html = editor.getHTML();
        onChange({ json, text, html });
      }
    },
  });

  // Sync external value changes without resetting cursor position
  useEffect(() => {
    if (!editor || !value) return;

    const currentJSON = JSON.stringify(editor.getJSON());
    const incomingJSON =
      typeof value === "string" ? value : JSON.stringify(value);

    if (currentJSON !== incomingJSON) {
      isUpdatingRef.current = true;
      // Close math modal if external value changes to prevent operating on stale document
      setMathModalState(null);
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
    if (disabled || readOnly) {
      setMathModalState(null);
    }
  }, [editor, disabled, readOnly]);

  const handleOpenMathModal = useCallback(() => {
    if (disabled || readOnly || !editor) return;
    savedSelectionRef.current = editor.state.selection.from;
    setMathModalState({
      open: true,
      type: "inline",
      latex: "",
      isEditing: false,
    });
  }, [disabled, readOnly, editor]);

  const handleSaveMath = useCallback(
    (type: MathType, latex: string) => {
      if (!editor || disabled || readOnly) {
        setMathModalState(null);
        return;
      }

      if (mathModalState?.isEditing && mathModalState.pos !== undefined) {
        const pos = mathModalState.pos;
        const oldType = mathModalState.type;

        // Check node at position
        const currentNode = editor.state.doc.nodeAt(pos);
        if (
          currentNode &&
          (currentNode.type.name === "inlineMath" ||
            currentNode.type.name === "blockMath")
        ) {
          if (oldType === type) {
            if (type === "inline") {
              editor.chain().focus().updateInlineMath({ latex, pos }).run();
            } else {
              editor.chain().focus().updateBlockMath({ latex, pos }).run();
            }
          } else {
            // Type conversion
            if (oldType === "inline") {
              editor.chain().focus().deleteInlineMath({ pos }).run();
            } else {
              editor.chain().focus().deleteBlockMath({ pos }).run();
            }

            if (type === "inline") {
              editor.chain().focus().insertInlineMath({ latex, pos }).run();
            } else {
              editor.chain().focus().insertBlockMath({ latex, pos }).run();
            }
          }
        } else {
          // Node position changed; insert at saved pos or current selection
          if (type === "inline") {
            editor.chain().focus().insertInlineMath({ latex, pos }).run();
          } else {
            editor.chain().focus().insertBlockMath({ latex, pos }).run();
          }
        }
      } else {
        const pos = savedSelectionRef.current ?? editor.state.selection.from;
        if (type === "inline") {
          editor.chain().focus().insertInlineMath({ latex, pos }).run();
        } else {
          editor.chain().focus().insertBlockMath({ latex, pos }).run();
        }
      }

      setMathModalState(null);
    },
    [editor, disabled, readOnly, mathModalState],
  );

  const handleDeleteMath = useCallback(() => {
    if (!editor || disabled || readOnly) {
      setMathModalState(null);
      return;
    }

    if (mathModalState?.isEditing && mathModalState.pos !== undefined) {
      const pos = mathModalState.pos;
      if (mathModalState.type === "inline") {
        editor.chain().focus().deleteInlineMath({ pos }).run();
      } else {
        editor.chain().focus().deleteBlockMath({ pos }).run();
      }
    }

    setMathModalState(null);
  }, [editor, disabled, readOnly, mathModalState]);

  const handleCloseMathModal = useCallback(() => {
    setMathModalState(null);
    if (editor && !disabled && !readOnly) {
      editor.commands.focus();
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
      {!readOnly && (
        <RichTextEditorToolbar
          editor={editor}
          disabled={disabled}
          onOpenMathModal={handleOpenMathModal}
        />
      )}
      <div className="relative flex-1">
        {editor?.isEmpty && !disabled && (
          <div className="absolute top-3 left-4 text-slate-400 pointer-events-none text-sm select-none">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>

      {mathModalState?.open && (
        <RichTextMathModal
          open={mathModalState.open}
          onClose={handleCloseMathModal}
          onSave={handleSaveMath}
          onDelete={mathModalState.isEditing ? handleDeleteMath : undefined}
          initialType={mathModalState.type}
          initialLatex={mathModalState.latex}
          isEditing={mathModalState.isEditing}
        />
      )}
    </div>
  );
}
