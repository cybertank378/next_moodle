// Files: src/sections/notification-management/__tests__/NotificationManagementComponents.test.tsx

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { NotificationCampaignResponseDto } from "@/modules/notification/domain/dto/NotificationCampaignResponseDto";
import {
  NotificationAudienceScope,
  NotificationChannel,
  NotificationDispatchStatus,
  NotificationOwnerScope,
} from "@/modules/notification/domain/types/NotificationTypes";
import NotificationCampaignStatusBadge from "@/sections/notification-management/atoms/NotificationCampaignStatusBadge";
import NotificationChannelBadge from "@/sections/notification-management/atoms/NotificationChannelBadge";
import NotificationCampaignFilters from "@/sections/notification-management/molecules/NotificationCampaignFilters";
import NotificationCampaignTable from "@/sections/notification-management/molecules/NotificationCampaignTable";
import NotificationChannelPanel from "@/sections/notification-management/molecules/NotificationChannelPanel";
import NotificationManagementHeader from "@/sections/notification-management/molecules/NotificationManagementHeader";
import NotificationPreviewPanel from "@/sections/notification-management/molecules/NotificationPreviewPanel";
import NotificationSummaryCards from "@/sections/notification-management/molecules/NotificationSummaryCards";

describe("Notification Management UI Components", () => {
  describe("NotificationCampaignStatusBadge", () => {
    it("renders DRAFT status correctly matching mockup", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignStatusBadge
          status={NotificationDispatchStatus.DRAFT}
        />,
      );
      expect(html).toContain("Draft");
      expect(html).toContain("bg-slate-100");
    });

    it("renders SCHEDULED status correctly with blue styling matching mockup", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignStatusBadge
          status={NotificationDispatchStatus.SCHEDULED}
        />,
      );
      expect(html).toContain("Terjadwal");
      expect(html).toContain("text-blue-700");
    });

    it("renders PROCESSING status with blue accent", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignStatusBadge
          status={NotificationDispatchStatus.PROCESSING}
        />,
      );
      expect(html).toContain("Memproses");
      expect(html).toContain("bg-blue-50");
      expect(html).toContain("text-blue-700");
    });

    it("renders COMPLETED status as Terkirim matching mockup", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignStatusBadge
          status={NotificationDispatchStatus.COMPLETED}
        />,
      );
      expect(html).toContain("Terkirim");
      expect(html).toContain("text-emerald-700");
    });

    it("renders FAILED status correctly", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignStatusBadge
          status={NotificationDispatchStatus.FAILED}
        />,
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

    it("renders PUSH channel badge matching soft sky pill in mockup", () => {
      const html = renderToStaticMarkup(
        <NotificationChannelBadge channel={NotificationChannel.PUSH} />,
      );
      expect(html).toContain("Push");
      expect(html).toContain("bg-sky-50");
      expect(html).toContain("text-sky-700");
    });
  });

  describe("NotificationManagementHeader", () => {
    it("renders platform header for ADMIN with Aksaventra context", () => {
      const html = renderToStaticMarkup(
        <NotificationManagementHeader
          userRole="ADMIN"
          onNewCampaign={vi.fn()}
          onRefresh={vi.fn()}
        />,
      );
      expect(html).toContain(
        "Aksaventra / Admin Platform / Pengelolaan Notifikasi",
      );
      expect(html).toContain("Pengelolaan Notifikasi");
      expect(html).toContain("Buat Pengumuman");
    });

    it("renders tenant header for TENANT with Aksaventra context", () => {
      const html = renderToStaticMarkup(
        <NotificationManagementHeader
          userRole="TENANT"
          onNewCampaign={vi.fn()}
          onRefresh={vi.fn()}
        />,
      );
      expect(html).toContain(
        "Aksaventra / Admin Sekolah / Pengelolaan Notifikasi",
      );
      expect(html).toContain(
        "Kelola pengumuman, penerima, dan jadwal pengiriman.",
      );
    });
  });

  describe("NotificationSummaryCards", () => {
    it("renders 4 summary cards with correct values", () => {
      const html = renderToStaticMarkup(
        <NotificationSummaryCards
          total={24}
          sent={18}
          scheduled={4}
          draft={2}
          loading={false}
        />,
      );
      expect(html).toContain("Total Pengumuman");
      expect(html).toContain("24");
      expect(html).toContain("Terkirim");
      expect(html).toContain("18");
      expect(html).toContain("Terjadwal");
      expect(html).toContain("4");
      expect(html).toContain("Draft");
      expect(html).toContain("2");
    });

    it("renders skeleton animation when loading", () => {
      const html = renderToStaticMarkup(
        <NotificationSummaryCards
          total={0}
          sent={0}
          scheduled={0}
          draft={0}
          loading={true}
        />,
      );
      expect(html).toContain("animate-pulse");
    });
  });

  describe("NotificationCampaignFilters", () => {
    it("renders status tabs with counts and channel options matching mockup", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignFilters
          search=""
          onSearchChange={vi.fn()}
          status="ALL"
          onStatusChange={vi.fn()}
          channel="ALL"
          onChannelChange={vi.fn()}
          isArchived={false}
          onArchiveToggle={vi.fn()}
          onResetFilters={vi.fn()}
          hasActiveFilters={false}
          counts={{ total: 24, sent: 18, scheduled: 4, draft: 2 }}
        />,
      );
      expect(html).toContain("Semua");
      expect(html).toContain("24");
      expect(html).toContain("Terkirim");
      expect(html).toContain("18");
      expect(html).toContain("Terjadwal");
      expect(html).toContain("4");
      expect(html).toContain("Draft");
      expect(html).toContain("2");
      expect(html).toContain("Arsip");
      expect(html).toContain("Semua Kanal");
      expect(html).toContain("Inbox");
      expect(html).toContain("Push");
    });

    it("renders reset filter button when active filters exist", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignFilters
          search="Ujian"
          onSearchChange={vi.fn()}
          status="ALL"
          onStatusChange={vi.fn()}
          channel="ALL"
          onChannelChange={vi.fn()}
          isArchived={false}
          onArchiveToggle={vi.fn()}
          onResetFilters={vi.fn()}
          hasActiveFilters={true}
        />,
      );
      expect(html).toContain("Reset Filter");
    });
  });

  describe("NotificationChannelPanel", () => {
    it("renders Inbox and Push channel options matching mockup", () => {
      const html = renderToStaticMarkup(
        <NotificationChannelPanel
          channels={[NotificationChannel.IN_APP, NotificationChannel.PUSH]}
          onChange={vi.fn()}
        />,
      );
      expect(html).toContain("Saluran Pengiriman");
      expect(html).toContain("Inbox Aplikasi");
      expect(html).toContain("Push Notifikasi");
    });

    it("renders error message when provided", () => {
      const html = renderToStaticMarkup(
        <NotificationChannelPanel
          channels={[]}
          onChange={vi.fn()}
          error="Pilih minimal satu saluran pengiriman."
        />,
      );
      expect(html).toContain("Pilih minimal satu saluran pengiriman.");
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

    it("renders campaigns in table rows with action menu matching mockup", () => {
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
      expect(html).toContain("Semua tenant");
      expect(html).toContain("Inbox");
      expect(html).toContain("Push");
      expect(html).toContain("Draft");
      expect(html).toContain("Aksi pengumuman");
    });

    it("renders empty state when no campaigns match filters", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignTable
          campaigns={[]}
          total={0}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
          onView={vi.fn()}
          onEdit={vi.fn()}
          onSend={vi.fn()}
          onDelete={vi.fn()}
          onArchive={vi.fn()}
          hasActiveFilters={true}
          onResetFilters={vi.fn()}
        />,
      );
      expect(html).toContain("Tidak ada hasil yang sesuai");
      expect(html).toContain("Reset Filter");
    });

    it("renders empty state when no campaigns exist overall matching mockup", () => {
      const html = renderToStaticMarkup(
        <NotificationCampaignTable
          campaigns={[]}
          total={0}
          currentPage={1}
          pageSize={10}
          onPageChange={vi.fn()}
          onView={vi.fn()}
          onEdit={vi.fn()}
          onSend={vi.fn()}
          onDelete={vi.fn()}
          onArchive={vi.fn()}
          hasActiveFilters={false}
          onNewCampaign={vi.fn()}
        />,
      );
      expect(html).toContain("Belum ada pengumuman");
      expect(html).toContain("Buat Pengumuman");
    });
  });

  describe("NotificationPreviewPanel", () => {
    it("renders in-app and mobile lockscreen preview with Aksaventra branding", () => {
      const html = renderToStaticMarkup(
        <NotificationPreviewPanel
          title="Pengumuman Libur Nasional"
          contentJson={{
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Libur dimulai besok." }],
              },
            ],
          }}
          plainText="Libur dimulai besok."
          pushSummary="Sekolah libur mulai besok."
          channels={["IN_APP", "PUSH"]}
        />,
      );

      expect(html).toContain("Pratinjau Inbox Aplikasi");
      expect(html).toContain("Pratinjau Notifikasi Push di Perangkat");
      expect(html).toContain("Aksaventra");
      expect(html).toContain("Pengumuman Libur Nasional");
      expect(html).toContain("Sekolah libur mulai besok.");
    });
  });
});
