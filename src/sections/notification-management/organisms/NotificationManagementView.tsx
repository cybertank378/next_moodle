// Files: src/sections/notification-management/organisms/NotificationManagementView.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import NotificationManagementHeader from "@/sections/notification-management/molecules/NotificationManagementHeader";
import NotificationCampaignFilters from "@/sections/notification-management/molecules/NotificationCampaignFilters";
import NotificationCampaignTable from "@/sections/notification-management/molecules/NotificationCampaignTable";
import NotificationActionModal from "@/sections/notification-management/molecules/NotificationActionModal";
import { useNotificationManagementApi } from "@/modules/notification/presentation/hooks/useNotificationManagementApi";

interface Props {
  role: "ADMIN" | "TENANT";
  onNewCampaign: () => void;
  onEditCampaign: (id: string) => void;
  onViewCampaign: (id: string) => void;
}

export default function NotificationManagementView({
  role,
  onNewCampaign,
  onEditCampaign,
  onViewCampaign,
}: Props) {
  const {
    campaigns,
    total,
    loading,
    error,
    fetchCampaigns,
    sendCampaign,
    deleteDraft,
    archiveCampaign,
  } = useNotificationManagementApi();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [isArchived, setIsArchived] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [activeModal, setActiveModal] = useState<{
    type: "SEND" | "DELETE";
    id: string;
    title: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(() => {
    fetchCampaigns({
      search: search.trim() || undefined,
      status: status !== "ALL" ? status : undefined,
      isArchived,
      page,
      limit: pageSize,
    });
  }, [fetchCampaigns, search, status, isArchived, page]);

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

  return (
    <div className="space-y-6">
      <NotificationManagementHeader
        role={role}
        onNewCampaign={onNewCampaign}
        onRefresh={loadData}
        loading={loading}
      />

      {error && (
        <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
          {error}
        </div>
      )}

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
        isArchived={isArchived}
        onArchiveToggle={() => {
          setIsArchived((prev) => !prev);
          setPage(1);
        }}
      />

      <NotificationCampaignTable
        campaigns={campaigns}
        total={total}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onView={onViewCampaign}
        onEdit={onEditCampaign}
        onSend={(id) => {
          const c = campaigns.find((x) => x.id === id);
          setActiveModal({
            type: "SEND",
            id,
            title: c?.title || "Pengumuman",
          });
        }}
        onDelete={(id) => {
          const c = campaigns.find((x) => x.id === id);
          setActiveModal({
            type: "DELETE",
            id,
            title: c?.title || "Draft",
          });
        }}
        onArchive={handleArchive}
        loading={loading}
      />

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
        confirmLabel={activeModal?.type === "SEND" ? "Kirim Sekarang" : "Hapus Draft"}
        variant={activeModal?.type === "DELETE" ? "danger" : "primary"}
        loading={actionLoading}
      />
    </div>
  );
}
