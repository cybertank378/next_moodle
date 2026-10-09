// Files: src/shared-ui/component/RichTextEditor/RichTextEditorField.tsx
"use client";

import RichTextEditor from "@/shared-ui/component/RichTextEditor/RichTextEditor";
import type { RichTextEditorFieldProps } from "@/shared-ui/component/RichTextEditor/RichTextEditorTypes";

export default function RichTextEditorField({
  label,
  helperText,
  error,
  required,
  id,
  ...editorProps
}: RichTextEditorFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-700 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      <RichTextEditor
        {...editorProps}
        ariaLabel={label || editorProps.ariaLabel}
      />

      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
