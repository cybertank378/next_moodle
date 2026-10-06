// Files: src/shared-ui/component/RichTextEditor/RichTextEditorTypes.ts

export type NeutralRichTextDocument = Record<string, unknown>;

export interface RichTextEditorProps {
  value?: NeutralRichTextDocument | string | null;
  onChange?: (val: {
    json: NeutralRichTextDocument;
    text: string;
    html: string;
  }) => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
  minHeight?: string;
  maxLength?: number;
}

export interface RichTextEditorFieldProps extends RichTextEditorProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  id?: string;
}

export interface RichTextViewerProps {
  content: NeutralRichTextDocument | string;
  className?: string;
}
