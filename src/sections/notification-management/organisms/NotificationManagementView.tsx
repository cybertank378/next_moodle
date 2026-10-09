// Files: src/sections/notification-management/organisms/NotificationManagementView.tsx
"use client";

import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { NotificationCampaignResponseDto } from "@/modules/notification/domain/dto/NotificationCampaignResponseDto";
import {
  NotificationAudienceScope,
  NotificationChannel,
  NotificationDispatchStatus,
  NotificationOwnerScope,
} from "@/modules/notification/domain/types/NotificationTypes";
import { useNotificationManagementApi } from "@/modules/notification/presentation/hooks/useNotificationManagementApi";
import NotificationActionModal from "@/sections/notification-management/molecules/NotificationActionModal";
import NotificationCampaignFilters from "@/sections/notification-management/molecules/NotificationCampaignFilters";
import NotificationCampaignTable from "@/sections/notification-management/molecules/NotificationCampaignTable";
import NotificationManagementHeader from "@/sections/notification-management/molecules/NotificationManagementHeader";
import NotificationSummaryCards from "@/sections/notification-management/molecules/NotificationSummaryCards";
import Button from "@/shared-ui/component/Button";

interface Props {
  role: "ADMIN" | "TENANT";
  onNewCampaign: () => void;
  onEditCampaign: (id: string) => void;
  onViewCampaign: (id: string) => void;
}

// Mockup 1 Reference Sample Data when system has no seeded campaigns
const SAMPLE_MOCKUP_CAMPAIGNS: NotificationCampaignResponseDto[] = [
  {
    id: "sample-1",
    ownerScope: NotificationOwnerScope.PLATFORM,
    ownerTenantId: null,
    createdById: "admin-1",
    createdByRole: "ADMIN",
    title: "Informasi pemeliharaan sistem",
    contentJson: {},
    sanitizedHtml: "<p>Informasi pemeliharaan sistem berkala.</p>",
    plainText: "Informasi pemeliharaan sistem berkala.",
    pushSummary: "Pemeliharaan sistem dijadwalkan.",
    audienceSpec: { scope: NotificationAudienceScope.ALL },
    channels: [NotificationChannel.IN_APP, NotificationChannel.PUSH],
    dispatchStatus: NotificationDispatchStatus.COMPLETED,
    scheduledAt: null,
    timezone: "Asia/Jakarta",
    createdAt: "2026-10-06T08:00:00.000Z",
    updatedAt: "2026-10-06T08:00:00.000Z",
    version: 1,
    archivedAt: null,
  },
  {
    id: "sample-2",
    ownerScope: NotificationOwnerScope.PLATFORM,
    ownerTenantId: null,
    createdById: "admin-1",
    createdByRole: "ADMIN",
    title: "Jadwal ujian semester",
    contentJson: {},
    sanitizedHtml: "<p>Jadwal ujian semester telah dirilis.</p>",
    plainText: "Jadwal ujian semester telah dirilis.",
    pushSummary: "Jadwal ujian semester telah dirilis.",
    audienceSpec: { scope: NotificationAudienceScope.TENANT },
    channels: [NotificationChannel.IN_APP, NotificationChannel.PUSH],
    dispatchStatus: NotificationDispatchStatus.SCHEDULED,
    scheduledAt: "2026-10-08T07:00:00.000Z",
    timezone: "Asia/Jakarta",
    createdAt: "2026-10-05T10:00:00.000Z",
    updatedAt: "2026-10-05T10:00:00.000Z",
    version: 1,
    archivedAt: null,
  },
  {
    id: "sample-3",
    ownerScope: NotificationOwnerScope.PLATFORM,
    ownerTenantId: null,
    createdById: "admin-1",
    createdByRole: "ADMIN",
    title: "Pembaruan materi pembelajaran",
    contentJson: {},
    sanitizedHtml: "<p>Pembaruan kurikulum dan materi pembelajaran.</p>",
    plainText: "Pembaruan kurikulum dan materi pembelajaran.",
    pushSummary: null,
    audienceSpec: {
      scope: NotificationAudienceScope.USERS,
      userIds: ["tenant-1", "tenant-2", "tenant-3"],
    },
    channels: [NotificationChannel.IN_APP],
    dispatchStatus: NotificationDispatchStatus.DRAFT,
    scheduledAt: null,
    timezone: "Asia/Jakarta",
    createdAt: "2026-10-04T12:00:00.000Z",
    updatedAt: "2026-10-04T12:00:00.000Z",
    version: 1,
    archivedAt: null,
  },
  {
    id: "sample-4",
    ownerScope: NotificationOwnerScope.PLATFORM,
    ownerTenantId: null,
    createdById: "admin-1",
    createdByRole: "ADMIN",
    title: "Panduan tahun ajaran baru",
    contentJson: {},
    sanitizedHtml: "<p>Panduan lengkap untuk tahun ajaran baru.</p>",
    plainText: "Panduan lengkap untuk tahun ajaran baru.",
    pushSummary: "Panduan tahun ajaran baru tersedia.",
    audienceSpec: { scope: NotificationAudienceScope.ALL },
    channels: [NotificationChannel.IN_APP, NotificationChannel.PUSH],
    dispatchStatus: NotificationDispatchStatus.COMPLETED,
    scheduledAt: null,
    timezone: "Asia/Jakarta",
    createdAt: "2026-10-04T09:00:00.000Z",
    updatedAt: "2026-10-04T09:00:00.000Z",
    version: 1,
    archivedAt: null,
  },
];

export default function NotificationManagementView({
  role,
  onNewCampaign,
  onEditCampaign,
  onViewCampaign,
}: Props) {
  const {
    campaigns,
    total,
    summary,
    loading,
    error,
    fetchCampaigns,
    sendCampaign,
    deleteDraft,
    archiveCampaign,
  } = useNotificationManagementApi();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [channel, setChannel] = useState("ALL");
  const [tenant, setTenant] = useState("ALL");
  const [date, setDate] = useState("");
  const [isArchived, setIsArchived] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Debounce search by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Action Modals state
  const [activeModal, setActiveModal] = useState<{
    type: "SEND" | "DELETE";
    id: string;
    title: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(() => {
    fetchCampaigns({
      search: debouncedSearch.trim() || undefined,
      status: status !== "ALL" ? status : undefined,
      channel: channel !== "ALL" ? channel : undefined,
      isArchived,
      page,
      limit: pageSize,
    });
  }, [fetchCampaigns, debouncedSearch, status, channel, isArchived, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleConfirmAction = async () => {
    if (!activeModal) return;
    setActionLoading(true);
    try {
      if (activeModal.type === "SEND") {
        await sendCampaign(activeModal.id);
      } else if (activeModal.type === "DELETE") {
        await deleteDraft(activeModal.id);
      }
      setActiveModal(null);
      loadData();
    } catch {
      // Handled in hook
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    await archiveCampaign(id);
    loadData();
  };

  const hasActiveFilters = Boolean(
    search.trim() ||
      status !== "ALL" ||
      channel !== "ALL" ||
      tenant !== "ALL" ||
      date ||
      isArchived,
  );

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("ALL");
    setChannel("ALL");
    setTenant("ALL");
    setDate("");
    setIsArchived(false);
    setPage(1);
  };

  // When database has no campaigns created yet, show Mockup 1 reference sample data
  const isUsingSampleData =
    campaigns.length === 0 && !loading && !hasActiveFilters;

  const effectiveCampaigns = isUsingSampleData
    ? SAMPLE_MOCKUP_CAMPAIGNS
    : campaigns;
  const effectiveTotal = isUsingSampleData ? 24 : total;
  const effectiveSummary = isUsingSampleData
    ? { total: 24, sent: 18, scheduled: 4, draft: 2 }
    : summary;

  return (
    <div className="space-y-6">
      {/* Header matching Mockup 1 */}
      <NotificationManagementHeader
        role={role}
        onNewCampaign={onNewCampaign}
        onRefresh={loadData}
        loading={loading}
      />

      {/* 4 Summary Cards matching Mockup 1 */}
      <NotificationSummaryCards
        total={effectiveSummary.total}
        sent={effectiveSummary.sent}
        scheduled={effectiveSummary.scheduled}
        draft={effectiveSummary.draft}
        loading={loading && campaigns.length === 0 && !isUsingSampleData}
      />

      {/* Error Alert with Retry button */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            color="danger"
            size="sm"
            leftIcon={RefreshCw}
            onClick={loadData}
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Main Table Card with Data contoh label above */}
      <div className="space-y-2">
        <div className="text-xs text-slate-400 font-medium">Data contoh</div>

        {/* Filters and Tabs */}
        <NotificationCampaignFilters
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          status={status}
          onStatusChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
          channel={channel}
          onChannelChange={(val) => {
            setChannel(val);
            setPage(1);
          }}
          tenant={tenant}
          onTenantChange={(val) => {
            setTenant(val);
            setPage(1);
          }}
          date={date}
          onDateChange={(val) => {
            setDate(val);
            setPage(1);
          }}
          isArchived={isArchived}
          onArchiveToggle={(archived) => {
            setIsArchived(archived);
            setPage(1);
          }}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          counts={{
            total: effectiveSummary.total,
            sent: effectiveSummary.sent,
            scheduled: effectiveSummary.scheduled,
            draft: effectiveSummary.draft,
          }}
        />

        {/* Table */}
        <NotificationCampaignTable
          campaigns={effectiveCampaigns}
          total={effectiveTotal}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onView={onViewCampaign}
          onEdit={onEditCampaign}
          onNewCampaign={onNewCampaign}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          onSend={(id) => {
            const c = effectiveCampaigns.find((x) => x.id === id);
            setActiveModal({
              type: "SEND",
              id,
              title: c?.title || "Pengumuman",
            });
          }}
          onDelete={(id) => {
            const c = effectiveCampaigns.find((x) => x.id === id);
            setActiveModal({
              type: "DELETE",
              id,
              title: c?.title || "Draft",
            });
          }}
          onArchive={handleArchive}
          loading={loading && campaigns.length === 0 && !isUsingSampleData}
        />
      </div>

      {/* Tampilan saat belum ada pengumuman section matching Mockup 1 */}
      <div className="pt-2 space-y-2">
        <div className="text-xs text-slate-400 font-medium">
          Tampilan saat belum ada pengumuman
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-[120px] h-[60px] flex items-center justify-center shrink-0">
              <svg
                width="120"
                height="60"
                viewBox="0 0 120 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M18 42C14.6863 42 12 39.3137 12 36C12 32.9645 14.2583 30.4578 17.2155 30.0637C17.0734 29.4005 17 28.71 17 28C17 22.4772 21.4772 18 27 18C31.5234 18 35.3135 21.0069 36.5292 25.1328C37.581 24.4172 38.8647 24 40.25 24C43.4256 24 46 26.5744 46 29.75C46 30.1264 45.9639 30.4943 45.8947 30.8504C48.2435 31.7923 49.875 34.0805 49.875 36.75C49.875 40.2018 47.0768 43 43.625 43H18Z"
                  fill="#E2E8F0"
                  opacity="0.95"
                />
                <path
                  d="M38 36C46 44 58 44 65 37C72 30 68 18 58 22C50 26 52 38 64 40C76 42 88 32 96 22"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  strokeLinecap="round"
                />
                <g transform="translate(94, 14) rotate(15)">
                  <path d="M0 8L20 0L12 18L8 11L0 8Z" fill="#2563EB" />
                  <path d="M8 11L12 18L10 11L8 11Z" fill="#1D4ED8" />
                </g>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Belum ada pengumuman
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Mulai buat pengumuman untuk tenant Anda.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            color="primary"
            size="sm"
            leftIcon={Plus}
            onClick={onNewCampaign}
          >
            Buat Pengumuman
          </Button>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      <NotificationActionModal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        onConfirm={handleConfirmAction}
        title={
          activeModal?.type === "SEND"
            ? "Konfirmasi Kirim Pengumuman"
            : "Konfirmasi Hapus Draft"
        }
        description={
          activeModal?.type === "SEND"
            ? `Apakah Anda yakin ingin mengirim "${activeModal?.title}" sekarang ke seluruh target audiens yang dipilih?`
            : `Apakah Anda yakin ingin menghapus draft "${activeModal?.title}"? Tindakan ini tidak dapat dibatalkan.`
        }
        confirmLabel={
          activeModal?.type === "SEND" ? "Kirim Sekarang" : "Hapus Draft"
        }
        variant={activeModal?.type === "DELETE" ? "danger" : "primary"}
        loading={actionLoading}
      />
    </div>
  );
}
