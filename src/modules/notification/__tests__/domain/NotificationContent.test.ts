// Files: src/modules/notification/__tests__/domain/NotificationContent.test.ts

import { describe, expect, it } from "vitest";
import { ValidationError } from "@/core/errors/ValidationError";
import { NotificationContent } from "@/modules/notification/domain/value-object/NotificationContent";

describe("NotificationContent Value Object", () => {
  it("creates valid content when all fields are within limits", () => {
    const content = NotificationContent.create({
      title: "Ujian Akhir Semester",
      contentJson: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Selamat mengikuti ujian." }],
          },
        ],
      },
      sanitizedHtml: "<p>Selamat mengikuti ujian.</p>",
      plainText: "Selamat mengikuti ujian.",
      pushSummary: "Pengumuman penting ujian.",
    });

    expect(content.title).toBe("Ujian Akhir Semester");
    expect(content.plainText).toBe("Selamat mengikuti ujian.");
    expect(content.pushSummary).toBe("Pengumuman penting ujian.");
    expect(content.contentSchemaVersion).toBe(1);
  });

  it("throws ValidationError when title is missing or blank", () => {
    expect(() => {
      NotificationContent.create({
        title: "   ",
        contentJson: { type: "doc" },
      });
    }).toThrow(ValidationError);
  });

  it("throws ValidationError when title exceeds 200 characters", () => {
    expect(() => {
      NotificationContent.create({
        title: "a".repeat(201),
        contentJson: { type: "doc" },
      });
    }).toThrow(ValidationError);
  });

  it("throws ValidationError when plain text exceeds 10,000 characters", () => {
    expect(() => {
      NotificationContent.create({
        title: "Valid Title",
        contentJson: { type: "doc" },
        plainText: "a".repeat(10001),
      });
    }).toThrow(ValidationError);
  });

  it("truncates pushSummary if it exceeds 200 characters", () => {
    const content = NotificationContent.create({
      title: "Valid Title",
      contentJson: { type: "doc" },
      pushSummary: "x".repeat(210),
    });

    expect(content.pushSummary?.length).toBeLessThanOrEqual(200);
    expect(content.pushSummary?.endsWith("...")).toBe(true);
  });
});
