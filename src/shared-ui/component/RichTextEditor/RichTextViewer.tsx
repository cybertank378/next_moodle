// Files: src/shared-ui/component/RichTextEditor/RichTextViewer.tsx
"use client";

import clsx from "clsx";
import type { RichTextViewerProps } from "@/shared-ui/component/RichTextEditor/RichTextEditorTypes";
import { richTextRenderer } from "@/shared-ui/component/RichTextEditor/richTextRenderer";

export default function RichTextViewer({
  content,
  className,
}: RichTextViewerProps) {
  let html = "";

  try {
    if (typeof content === "string") {
      const trimmed = content.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
          const parsed = JSON.parse(trimmed) as Record<string, unknown>;
          html = richTextRenderer.renderToSanitizedHtml(parsed);
        } catch {
          html = richTextRenderer.renderHtmlWithMath(content);
        }
      } else {
        html = richTextRenderer.renderHtmlWithMath(content);
      }
    } else if (content && typeof content === "object") {
      html = richTextRenderer.renderToSanitizedHtml(
        content as Record<string, unknown>,
      );
    }
  } catch {
    html = "";
  }

  return (
    <div
      className={clsx(
        "prose prose-sm max-w-none text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto",
        className,
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized rich text with KaTeX
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
