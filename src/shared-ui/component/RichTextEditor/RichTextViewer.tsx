// Files: src/shared-ui/component/RichTextEditor/RichTextViewer.tsx
"use client";

import clsx from "clsx";
import { NotificationContentRenderer } from "@/modules/notification/infrastructure/providers/NotificationContentRenderer";
import type { RichTextViewerProps } from "@/shared-ui/component/RichTextEditor/RichTextEditorTypes";

const renderer = new NotificationContentRenderer();

export default function RichTextViewer({
  content,
  className,
}: RichTextViewerProps) {
  let html = "";

  if (typeof content === "string") {
    html = renderer.renderHtmlWithMath(content);
  } else if (content && typeof content === "object") {
    html = renderer.renderToSanitizedHtml(content);
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
