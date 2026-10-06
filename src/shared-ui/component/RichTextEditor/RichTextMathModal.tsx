// Files: src/shared-ui/component/RichTextEditor/RichTextMathModal.tsx
"use client";

import clsx from "clsx";
import katex from "katex";
import { Calculator, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Button from "@/shared-ui/component/Button";
import { Modal } from "@/shared-ui/component/Modal";
import type { MathType } from "@/shared-ui/component/RichTextEditor/richTextEditorExtensions";
import TextAreaField from "@/shared-ui/component/TextAreaField";

export type { MathType };

export interface RichTextMathModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (type: MathType, latex: string) => void;
  onDelete?: () => void;
  initialType?: MathType;
  initialLatex?: string;
  isEditing?: boolean;
}

const MATH_EXAMPLES = [
  { label: "Pecahan", latex: "\\frac{a}{b}" },
  { label: "Akar", latex: "\\sqrt{x}" },
  { label: "Pangkat", latex: "x^2 + y^2" },
  { label: "Indeks", latex: "a_n" },
  { label: "Persamaan", latex: "2x + 5 = 15" },
  {
    label: "Rumus Kuadrat",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
  },
];

function validateLatexSyntax(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return "Rumus tidak boleh kosong.";
  }
  try {
    katex.renderToString(trimmed, { throwOnError: true, trust: false });
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : "Rumus tidak valid.";
  }
}

export default function RichTextMathModal({
  open,
  onClose,
  onSave,
  onDelete,
  initialType = "inline",
  initialLatex = "",
  isEditing = false,
}: RichTextMathModalProps) {
  const [mathType, setMathType] = useState<MathType>(initialType);
  const [latex, setLatex] = useState<string>(initialLatex);
  const [touched, setTouched] = useState<boolean>(false);

  // Sync state whenever modal opens or props change
  useEffect(() => {
    if (open) {
      setMathType(initialType);
      setLatex(initialLatex);
      setTouched(false);
    }
  }, [open, initialType, initialLatex]);

  const validationError = useMemo(() => {
    return validateLatexSyntax(latex);
  }, [latex]);

  const previewHtml = useMemo(() => {
    const trimmed = latex.trim();
    if (!trimmed) return "";
    try {
      return katex.renderToString(trimmed, {
        displayMode: mathType === "block",
        throwOnError: false,
        trust: false,
      });
    } catch {
      return "";
    }
  }, [latex, mathType]);

  const handleSubmit = () => {
    setTouched(true);
    const err = validateLatexSyntax(latex);
    if (err) return;
    onSave(mathType, latex.trim());
  };

  const handleInsertSnippet = (snippet: string) => {
    setTouched(true);
    setLatex(snippet);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Rumus Matematika" : "Sisipkan Rumus Matematika"}
      subtitle="Ketik kode LaTeX untuk rumus inline (dalam kalimat) atau block (baris terpisah)."
      size="md"
    >
      <div className="space-y-5">
        {/* Type Selector (Inline vs Block) */}
        <div>
          <span className="block text-xs font-semibold text-slate-700 mb-2">
            Tipe Rumus
          </span>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setMathType("inline")}
              className={clsx(
                "py-2 px-3 text-xs font-semibold rounded-lg transition-all text-center",
                mathType === "inline"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900",
              )}
            >
              Inline (Dalam Kalimat)
            </button>
            <button
              type="button"
              onClick={() => setMathType("block")}
              className={clsx(
                "py-2 px-3 text-xs font-semibold rounded-lg transition-all text-center",
                mathType === "block"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900",
              )}
            >
              Block (Baris Terpisah)
            </button>
          </div>
        </div>

        {/* Example Formula Chips */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Contoh Rumus Cepat
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MATH_EXAMPLES.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => handleInsertSnippet(example.latex)}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200 transition-colors"
                title={`Gunakan: ${example.latex}`}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        {/* LaTeX Code Input */}
        <div>
          <TextAreaField
            label="Kode LaTeX (tanpa tanda $)"
            placeholder="Contoh: \frac{a}{b} atau x^2 + y^2 = z^2"
            value={latex}
            onChange={(e) => {
              setLatex(e.target.value);
              setTouched(true);
            }}
            error={touched && validationError ? validationError : undefined}
            helperText="Masukkan rumus murni tanpa pembatas tanda dollar ($ atau $$)."
            size="sm"
            rows={3}
            autoFocus
          />
        </div>

        {/* Live KaTeX Preview */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            <Calculator className="w-3.5 h-3.5 text-indigo-500" />
            Pratinjau Rumus
          </div>
          <div
            className={clsx(
              "min-h-[72px] p-4 rounded-xl border flex items-center justify-center overflow-x-auto transition-all",
              validationError && touched && latex.trim()
                ? "bg-rose-50/50 border-rose-200 text-rose-600"
                : "bg-slate-50 border-slate-200 text-slate-900",
            )}
          >
            {previewHtml ? (
              <div
                className="max-w-full text-base sm:text-lg"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized KaTeX math preview
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <span className="text-xs text-slate-400 italic">
                Pratinjau rumus akan muncul di sini...
              </span>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            {isEditing && onDelete ? (
              <Button
                type="button"
                variant="outline"
                color="error"
                size="sm"
                leftIcon={Trash2}
                onClick={onDelete}
              >
                Hapus
              </Button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="button"
              variant="filled"
              color="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={!latex.trim() || Boolean(validationError)}
            >
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
