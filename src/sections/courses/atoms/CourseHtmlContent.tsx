"use client";

import clsx from "clsx";
import RichTextViewer from "@/shared-ui/component/RichTextEditor/RichTextViewer";

interface CourseHtmlContentProps {
  content: string;
  className?: string;
}

export default function CourseHtmlContent({
  content,
  className,
}: CourseHtmlContentProps) {
  return (
    <RichTextViewer
      content={content}
      className={clsx("text-slate-600 leading-relaxed", className)}
    />
  );
}
