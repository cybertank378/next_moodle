// Files: src/sections/notification-management/__tests__/NotificationManagementComponents.test.tsx

import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import NotificationCampaignStatusBadge from "@/sections/notification-management/atoms/NotificationCampaignStatusBadge";
import NotificationChannelBadge from "@/sections/notification-management/atoms/NotificationChannelBadge";
import NotificationManagementHeader from "@/sections/notification-management/molecules/NotificationManagementHeader";
import NotificationCampaignTable from "@/sections/notification-management/molecules/NotificationCampaignTable";
import NotificationPreviewPanel from "@/sections/notification-management/molecules/NotificationPreviewPanel";
import {
  NotificationAudienceScope,
  NotificationChannel,
  NotificationDispatchStatus,
  NotificationOwnerScope,
} from "@/modules/notification/domain/types/NotificationTypes";
import type { NotificationCampaignResponseDto } from "@/modules/notification/domain/dto/NotificationCampaignResponseDto";

describe("Notification Management UI Components", () => {
  describe("NotificationCampaignStatusBadge", () => {
    it("renders DRAFT status correctly", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignStatusBadge status={NotificationDispatchStatus.DRAFT} />,
      );
      expect(html).toContain("Draft");
      expect(html).toContain("bg-slate-50");
    });

    it("renders SCHEDULED status correctly", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignStatusBadge status={NotificationDispatchStatus.SCHEDULED} />,
      );
      expect(html).toContain("Terjadwal");
      expect(html).toContain("text-amber-700");
    });

    it("renders COMPLETED status correctly", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignStatusBadge status={NotificationDispatchStatus.COMPLETED} />,
      );
      expect(html).toContain("Selesai");
      expect(html).toContain("text-emerald-700");
    });

    it("renders FAILED status correctly", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignStatusBadge status={NotificationDispatchStatus.FAILED} />,
      );
      expect(html).toContain("Gagal");
      expect(html).toContain("text-rose-700");
    });

    it("renders archived badge when isArchived is true", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignStatusBadge
          status={NotificationDispatchStatus.COMPLETED}
          isArchived={true}
        />,
      );
      expect(html).toContain("Diarsipkan");
    });
  });

  describe("NotificationChannelBadge", () => {
    it("renders IN_APP channel badge", () => {
      const html = renderToStaticMarkup(
        <NotificationChannelBadge channel={NotificationChannel.IN_APP} />,
      );
      expect(html).toContain("Inbox");
    });

    it("renders PUSH channel badge", () => {
      const html = renderToStaticMarkup(
        <NotificationChannelBadge channel={NotificationChannel.PUSH} />,
      );
      expect(html).toContain("Push FCM");
    });
  });

  describe("NotificationManagementHeader", () => {
    it("renders platform header for ADMIN", () => {
      const html = renderToStaticMarkup(
        <NotificationManagementHeader
          role="ADMIN"
          onNewCampaign={vi.fn()}
          onRefresh={vi.fn()}
        />,
      );
      expect(html).toContain("Admin / Pengumuman &amp; Notifikasi");
      expect(html).toContain("Pengelolaan Pengumuman &amp; Notifikasi");
      expect(html).toContain("Buat Pengumuman Baru");
    });

    it("renders tenant header for TENANT", () => {
      const html = renderToStaticMarkup(
        <NotificationManagementHeader
          role="TENANT"
          onNewCampaign={vi.fn()}
          onRefresh={vi.fn()}
        />,
      );
      expect(html).toContain("Tenant / Pengumuman &amp; Notifikasi");
      expect(html).toContain("Sekolah");
    });
  });

  describe("NotificationCampaignTable", () => {
    const sampleCampaigns: NotificationCampaignResponseDto[] = [
      {
        id: "camp-1",
        ownerScope: NotificationOwnerScope.TENANT,
        ownerTenantId: "tenant-1",
        createdById: "user-1",
        createdByRole: "TENANT",
        title: "Ujian Akhir Semester Genap",
        contentJson: { type: "doc" },
        sanitizedHtml: "<p>Jadwal UAS</p>",
        plainText: "Jadwal UAS",
        pushSummary: "Pengumuman UAS",
        audienceSpec: { scope: NotificationAudienceScope.ALL },
        channels: [NotificationChannel.IN_APP, NotificationChannel.PUSH],
        dispatchStatus: NotificationDispatchStatus.DRAFT,
        scheduledAt: null,
        timezone: "Asia/Jakarta",
        archivedAt: null,
        version: 1,
        createdAt: "2026-10-06T00:00:00Z",
        updatedAt: "2026-10-06T00:00:00Z",
      },
    ];

    it("renders campaigns in table rows with action buttons", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignTable
          campaigns={sampleCampaigns}
          total={1}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
          onView={vi.fn()}
          onEdit={vi.fn()}
          onSend={vi.fn()}
          onDelete={vi.fn()}
          onArchive={vi.fn()}
        />,
      );

      expect(html).toContain("Ujian Akhir Semester Genap");
      expect(html).toContain("Seluruh Pengguna");
      expect(html).toContain("Inbox");
      expect(html).toContain("Push FCM");
      expect(html).toContain("Draft");
      expect(html).toContain("Lihat Detail");
      expect(html).toContain("Ubah Draft");
      expect(html).toContain("Kirim Sekarang");
    });
  });

  describe("NotificationPreviewPanel", () => {
    it("renders in-app and mobile lockscreen preview", () => {
      const html = renderToStaticMarkup(
        <NotificationPreviewPanel
          title="Pengumuman Libur Nasional"
          contentJson={{
            type: "doc",
            content: [{ type: "paragraph", content: [{ type: "text", text: "Libur dimulai besok." }] }],
          }}
          plainText="Libur dimulai besok."
          pushSummary="Sekolah libur mulai besok."
          channels={["IN_APP", "PUSH"]}
        />,
      );

      expect(html).toContain("Pratinjau Inbox Aplikasi");
      expect(html).toContain("Pratinjau Notifikasi Push di Perangkat");
      expect(html).toContain("Pengumuman Libur Nasional");
      expect(html).toContain("Sekolah libur mulai besok.");
    });
  });
});
