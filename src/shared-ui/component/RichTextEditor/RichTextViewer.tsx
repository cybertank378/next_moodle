// Files: src/shared-ui/component/RichTextEditor/RichTextViewer.tsx
"use client";

import clsx from "clsx";
import type { RichTextViewerProps } from "@/shared-ui/component/RichTextEditor/RichTextEditorTypes";
import { NotificationContentRenderer } from "@/modules/notification/infrastructure/providers/NotificationContentRenderer";

const renderer = new NotificationContentRenderer();

export default function RichTextViewer({ content, className }: RichTextViewerProps) {
  let html = "";

  if (typeof content === "string") {
    html = content;
  } else if (content && typeof content === "object") {
    html = renderer.renderToSanitizedHtml(content);
  }

  return (
    <div
      className={clsx(
        "prose prose-sm max-w-none text-slate-800 leading-relaxed",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
