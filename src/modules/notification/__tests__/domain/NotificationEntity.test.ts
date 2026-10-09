import { describe, expect, it } from "vitest";
import { NotificationEntity } from "@/modules/notification/domain/entity/NotificationEntity";
import { NotificationType } from "@/modules/notification/domain/types/NotificationTypes";

const baseProps = {
  id: "notif-1",
  tenantId: "tenant-abc",
  recipientId: "user-42",
  recipientRole: "STUDENT",
  type: NotificationType.EXAM_RESULT_AVAILABLE,
  title: "Hasil ujian tersedia",
  body: "Nilai ujian Matematika kamu sudah bisa dilihat.",
  linkPath: "/student/grades",
  isRead: false,
  readAt: null,
  createdAt: new Date("2026-10-01T08:00:00Z"),
};

describe("NotificationEntity", () => {
  it("should construct with valid props", () => {
    const entity = new NotificationEntity(baseProps);
    expect(entity.id).toBe("notif-1");
    expect(entity.tenantId).toBe("tenant-abc");
    expect(entity.recipientId).toBe("user-42");
    expect(entity.type).toBe(NotificationType.EXAM_RESULT_AVAILABLE);
    expect(entity.isRead).toBe(false);
  });

  it("should report isUnread correctly", () => {
    const unread = new NotificationEntity({ ...baseProps, isRead: false });
    const read = new NotificationEntity({
      ...baseProps,
      isRead: true,
      readAt: new Date(),
    });
    expect(unread.isUnread).toBe(true);
    expect(read.isUnread).toBe(false);
  });

  it("should mark as read and return new entity", () => {
    const entity = new NotificationEntity(baseProps);
    const marked = entity.markAsRead();
    expect(marked.isRead).toBe(true);
    expect(marked.readAt).toBeInstanceOf(Date);
    // Original entity should not be mutated
    expect(entity.isRead).toBe(false);
  });

  it("should serialize to JSON without undefined fields", () => {
    const entity = new NotificationEntity(baseProps);
    const json = entity.toJSON();
    expect(json.id).toBe("notif-1");
    expect(json.isRead).toBe(false);
    expect(json.linkPath).toBe("/student/grades");
  });

  it("should throw if id is empty", () => {
    expect(() => new NotificationEntity({ ...baseProps, id: "" })).toThrow(
      /id/i,
    );
  });

  it("should throw if tenantId is empty for a tenant-scoped role", () => {
    expect(
      () => new NotificationEntity({ ...baseProps, tenantId: "" }),
    ).toThrow(/tenantId/i);
    expect(
      () => new NotificationEntity({ ...baseProps, tenantId: null }),
    ).toThrow(/tenantId/i);
  });

  it("should allow tenantId=null for an ADMIN platform notification", () => {
    const entity = new NotificationEntity({
      ...baseProps,
      tenantId: null,
      recipientRole: "ADMIN",
      type: NotificationType.TENANT_REGISTERED,
    });
    expect(entity.tenantId).toBeNull();
  });

  it("should throw if an ADMIN notification is bound to a tenant", () => {
    expect(
      () =>
        new NotificationEntity({
          ...baseProps,
          tenantId: "tenant-abc",
          recipientRole: "ADMIN",
        }),
    ).toThrow(/tenantId/i);
  });

  it("should throw if recipientRole is unknown", () => {
    expect(
      () => new NotificationEntity({ ...baseProps, recipientRole: "PROCTOR" }),
    ).toThrow(/recipientRole/i);
  });

  it("should throw if recipientId is empty", () => {
    expect(
      () => new NotificationEntity({ ...baseProps, recipientId: "" }),
    ).toThrow(/recipientId/i);
  });

  it("should throw if title is empty", () => {
    expect(() => new NotificationEntity({ ...baseProps, title: "" })).toThrow(
      /title/i,
    );
  });
});
