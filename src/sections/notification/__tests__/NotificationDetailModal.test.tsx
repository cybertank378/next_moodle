// Files: src/sections/notification/__tests__/NotificationDetailModal.test.tsx

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { NotificationType } from "@/modules/notification/domain/types/NotificationTypes";
import NotificationDetailModal from "@/sections/notification/molecules/NotificationDetailModal";

describe("NotificationDetailModal", () => {
  const sampleNotification = {
    id: "n-detail-1",
    type: NotificationType.ANNOUNCEMENT,
    title: "Detail Judul Notifikasi",
    body: "Ini adalah isi lengkap pesan notifikasi untuk pengujian.",
    linkPath: null,
    isRead: true,
    createdAt: "2026-10-07T12:00:00.000Z",
    readAt: "2026-10-07T12:05:00.000Z",
  };

  it("returns null when notification is null", () => {
    const html = renderToStaticMarkup(
      <NotificationDetailModal notification={null} onClose={vi.fn()} />,
    );
    expect(html).toBe("");
  });

  it("renders modal with notification title and body when provided", () => {
    const html = renderToStaticMarkup(
      <NotificationDetailModal
        notification={sampleNotification}
        onClose={vi.fn()}
      />,
    );

    expect(html).toContain("Detail Judul Notifikasi");
    expect(html).toContain(
      "Ini adalah isi lengkap pesan notifikasi untuk pengujian.",
    );
    expect(html).toContain("Waktu Pengiriman");
    expect(html).toContain("Tutup");
  });
});
