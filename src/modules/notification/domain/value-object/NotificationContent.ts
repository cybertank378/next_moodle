// Files: src/modules/notification/domain/value-object/NotificationContent.ts

import { ValidationError } from "@/core/errors/ValidationError";

export interface NotificationContentInput {
  title: string;
  contentJson: Record<string, unknown>;
  sanitizedHtml?: string;
  plainText?: string;
  pushSummary?: string | null;
}

export class NotificationContent {
  readonly title: string;
  readonly contentJson: Record<string, unknown>;
  readonly contentSchemaVersion: number;
  readonly sanitizedHtml: string;
  readonly plainText: string;
  readonly pushSummary: string | null;

  private constructor(
    title: string,
    contentJson: Record<string, unknown>,
    contentSchemaVersion: number,
    sanitizedHtml: string,
    plainText: string,
    pushSummary: string | null,
  ) {
    this.title = title;
    this.contentJson = contentJson;
    this.contentSchemaVersion = contentSchemaVersion;
    this.sanitizedHtml = sanitizedHtml;
    this.plainText = plainText;
    this.pushSummary = pushSummary;
    Object.freeze(this);
  }

  static create(input: NotificationContentInput): NotificationContent {
    const title = input.title?.trim();
    if (!title) {
      throw new ValidationError("Judul notifikasi wajib diisi.");
    }
    if (title.length > 200) {
      throw new ValidationError("Judul notifikasi maksimal 200 karakter.");
    }

    if (!input.contentJson || typeof input.contentJson !== "object") {
      throw new ValidationError("Konten notifikasi dalam format JSON tidak valid.");
    }

    const serialized = JSON.stringify(input.contentJson);
    if (serialized.length > 51200) {
      throw new ValidationError("Ukuran konten rich text melebihi batas 50KB.");
    }

    const plainText = (input.plainText ?? "").trim();
    if (plainText.length > 10000) {
      throw new ValidationError("Teks konten melebihi batas maksimum 10.000 karakter.");
    }

    let pushSummary = input.pushSummary?.trim() || null;
    if (pushSummary && pushSummary.length > 200) {
      pushSummary = pushSummary.slice(0, 197) + "...";
    }

    return new NotificationContent(
      title,
      input.contentJson,
      1,
      input.sanitizedHtml || "",
      plainText,
      pushSummary,
    );
  }
}
