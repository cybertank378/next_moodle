// Files: src/modules/notification/domain/interfaces/NotificationContentRendererInterface.ts

export interface NotificationContentRendererInterface {
  renderToSanitizedHtml(contentJson: Record<string, unknown>): string;
  extractPlainText(contentJson: Record<string, unknown>): string;
  renderHtmlWithMath?(rawHtml: string): string;
}
