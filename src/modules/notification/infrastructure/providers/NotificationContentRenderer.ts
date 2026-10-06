// Files: src/modules/notification/infrastructure/providers/NotificationContentRenderer.ts

import katex from "katex";
import type { NotificationContentRendererInterface } from "@/modules/notification/domain/interfaces/NotificationContentRendererInterface";

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
}

export class NotificationContentRenderer
  implements NotificationContentRendererInterface
{
  renderToSanitizedHtml(contentJson: Record<string, unknown>): string {
    if (!contentJson || typeof contentJson !== "object") {
      return "";
    }
    return this.renderNode(contentJson as unknown as TiptapNode);
  }

  extractPlainText(contentJson: Record<string, unknown>): string {
    if (!contentJson || typeof contentJson !== "object") {
      return "";
    }
    const lines: string[] = [];
    this.collectText(contentJson as unknown as TiptapNode, lines);
    return lines.join(" ").replace(/\s+/g, " ").trim();
  }

  renderHtmlWithMath(rawHtml: string): string {
    if (!rawHtml || typeof rawHtml !== "string") {
      return "";
    }

    // 1. Sanitize raw HTML from dangerous scripts and event handlers
    let sanitized = rawHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/\son\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, "")
      .replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, 'href="#"');

    // 2. Render inline math markers: <span ... data-type="inline-math" ...>
    sanitized = sanitized.replace(
      /<span\b([^>]*\bdata-type=["']inline-math["'][^>]*)>(?:[\s\S]*?)<\/span>/gi,
      (full, attrs) => {
        const match = attrs.match(/\bdata-latex=(["'])(.*?)\1/i);
        const latex = match ? match[2] : "";
        if (!latex) return full;
        const unescaped = this.decodeHtmlEntities(latex);
        try {
          const mathHtml = katex.renderToString(unescaped, {
            displayMode: false,
            throwOnError: false,
            trust: false,
          });
          return `<span class="math-inline inline-block align-middle" data-type="inline-math" data-latex="${this.escapeHtml(unescaped)}">${mathHtml}</span>`;
        } catch {
          return full;
        }
      },
    );

    // 3. Render block math markers: <div ... data-type="block-math" ...>
    sanitized = sanitized.replace(
      /<div\b([^>]*\bdata-type=["']block-math["'][^>]*)>(?:[\s\S]*?)<\/div>/gi,
      (full, attrs) => {
        const match = attrs.match(/\bdata-latex=(["'])(.*?)\1/i);
        const latex = match ? match[2] : "";
        if (!latex) return full;
        const unescaped = this.decodeHtmlEntities(latex);
        try {
          const mathHtml = katex.renderToString(unescaped, {
            displayMode: true,
            throwOnError: false,
            trust: false,
          });
          return `<div class="math-block overflow-x-auto my-3 py-1 text-center" data-type="block-math" data-latex="${this.escapeHtml(unescaped)}">${mathHtml}</div>`;
        } catch {
          return full;
        }
      },
    );

    return sanitized;
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  private decodeHtmlEntities(str: string): string {
    return str
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#x27;/g, "'");
  }

  private sanitizeUrl(url?: unknown): string {
    if (typeof url !== "string") return "#";
    const trimmed = url.trim();
    if (
      trimmed.startsWith("https://") ||
      trimmed.startsWith("http://") ||
      trimmed.startsWith("mailto:") ||
      trimmed.startsWith("/")
    ) {
      return this.escapeHtml(trimmed);
    }
    return "#";
  }

  private renderNode(node: TiptapNode): string {
    if (!node?.type) return "";

    if (node.type === "text") {
      let text = this.escapeHtml(node.text || "");
      if (node.marks && Array.isArray(node.marks)) {
        for (const mark of node.marks) {
          if (mark.type === "bold") {
            text = `<strong>${text}</strong>`;
          } else if (mark.type === "italic") {
            text = `<em>${text}</em>`;
          } else if (mark.type === "strike") {
            text = `<s>${text}</s>`;
          } else if (mark.type === "link") {
            const href = this.sanitizeUrl(mark.attrs?.href);
            text = `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 underline">${text}</a>`;
          }
        }
      }
      return text;
    }

    if (node.type === "inlineMath") {
      const latex =
        typeof node.attrs?.latex === "string" ? node.attrs.latex : "";
      let mathHtml = "";
      try {
        mathHtml = katex.renderToString(latex, {
          displayMode: false,
          throwOnError: false,
          trust: false,
        });
      } catch {
        mathHtml = this.escapeHtml(latex);
      }
      return `<span class="math-inline inline-block align-middle" data-type="inline-math" data-latex="${this.escapeHtml(latex)}">${mathHtml}</span>`;
    }

    if (node.type === "blockMath") {
      const latex =
        typeof node.attrs?.latex === "string" ? node.attrs.latex : "";
      let mathHtml = "";
      try {
        mathHtml = katex.renderToString(latex, {
          displayMode: true,
          throwOnError: false,
          trust: false,
        });
      } catch {
        mathHtml = this.escapeHtml(latex);
      }
      return `<div class="math-block overflow-x-auto my-3 py-1 text-center" data-type="block-math" data-latex="${this.escapeHtml(latex)}">${mathHtml}</div>`;
    }

    const childrenHtml =
      node.content && Array.isArray(node.content)
        ? node.content.map((child) => this.renderNode(child)).join("")
        : "";

    switch (node.type) {
      case "doc":
        return childrenHtml;
      case "paragraph":
        return `<p class="mb-2 leading-relaxed">${childrenHtml || "<br />"}</p>`;
      case "heading": {
        const level = Number(node.attrs?.level) || 2;
        if (level === 2) {
          return `<h2 class="text-xl font-bold mt-4 mb-2">${childrenHtml}</h2>`;
        }
        return `<h3 class="text-lg font-semibold mt-3 mb-1.5">${childrenHtml}</h3>`;
      }
      case "bulletList":
        return `<ul class="list-disc pl-5 mb-2 space-y-1">${childrenHtml}</ul>`;
      case "orderedList":
        return `<ol class="list-decimal pl-5 mb-2 space-y-1">${childrenHtml}</ol>`;
      case "listItem":
        return `<li>${childrenHtml}</li>`;
      case "blockquote":
        return `<blockquote class="border-l-4 border-slate-300 pl-3 italic my-2 text-slate-600">${childrenHtml}</blockquote>`;
      default:
        return childrenHtml;
    }
  }

  private collectText(node: TiptapNode, acc: string[]): void {
    if (!node) return;
    if (node.type === "text" && node.text) {
      acc.push(node.text);
    }
    if (
      (node.type === "inlineMath" || node.type === "blockMath") &&
      typeof node.attrs?.latex === "string" &&
      node.attrs.latex.trim()
    ) {
      acc.push(node.attrs.latex.trim());
    }
    if (node.content && Array.isArray(node.content)) {
      for (const child of node.content) {
        this.collectText(child, acc);
      }
    }
  }
}
