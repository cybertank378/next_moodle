// Files: src/modules/notification/infrastructure/providers/NotificationContentRenderer.ts

import type { NotificationContentRendererInterface } from "@/modules/notification/domain/interfaces/NotificationContentRendererInterface";

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
}

export class NotificationContentRenderer implements NotificationContentRendererInterface {
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

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
    if (!node || !node.type) return "";

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

    const childrenHtml = node.content && Array.isArray(node.content)
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
    if (node.content && Array.isArray(node.content)) {
      for (const child of node.content) {
        this.collectText(child, acc);
      }
    }
  }
}
