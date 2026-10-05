// Files: src/sections/notification-management/organisms/NotificationCampaignDetailView.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Clock, Calendar, Send, XCircle, RefreshCw } from "lucide-react";
import Button from "@/shared-ui/component/Button";
import NotificationCampaignStatusBadge from "@/sections/notification-management/atoms/NotificationCampaignStatusBadge";
import NotificationChannelBadge from "@/sections/notification-management/atoms/NotificationChannelBadge";
import NotificationDeliveryTable from "@/sections/notification-management/molecules/NotificationDeliveryTable";
import RichTextViewer from "@/shared-ui/component/RichTextEditor/RichTextViewer";
import { useNotificationManagementApi } from "@/modules/notification/presentation/hooks/useNotificationManagementApi";
import type {
  NotificationCampaignResponseDto,
  NotificationDeliveryItemDto,
} from "@/modules/notification/domain/dto/NotificationCampaignResponseDto";
import type { NotificationDeliverySummary } from "@/modules/notification/domain/types/NotificationTypes";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface Props {
  campaignId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export default function NotificationCampaignDetailView({ campaignId, onBack, onEdit }: Props) {
  const {
    fetchCampaign,
    fetchDeliveryReport,
    sendCampaign,
    cancelCampaign,
    retryDelivery,
    loading,
  } = useNotificationManagementApi();

  const [campaign, setCampaign] = useState<NotificationCampaignResponseDto | null>(null);
  const [deliveries, setDeliveries] = useState<NotificationDeliveryItemDto[]>([]);
  const [summary, setSummary] = useState<NotificationDeliverySummary | undefined>();
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [page, setPage] = useState(1);
  const [retrying, setRetrying] = useState(false);

  const loadData = useCallback(() => {
    fetchCampaign(campaignId).then((c) => {
      setCampaign(c);
      setSummary(c.summary);
    });

    fetchDeliveryReport(campaignId, page, 20).then((res) => {
      setDeliveries(res.items);
      setTotalDeliveries(res.total);
      if (res.summary) setSummary(res.summary);
    });
  }, [campaignId, fetchCampaign, fetchDeliveryReport, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSend = async () => {
    await sendCampaign(campaignId);
    loadData();
  };

  const handleCancel = async () => {
    await cancelCampaign(campaignId);
    loadData();
  };

  const handleRetryFailed = async () => {
    setRetrying(true);
    try {
      await retryDelivery(campaignId);
      loadData();
    } finally {
      setRetrying(false);
    }
  };

  if (!campaign) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        {loading ? "Memuat detail pengumuman..." : "Pengumuman tidak ditemukan."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <NotificationCampaignStatusBadge
                status={campaign.dispatchStatus}
                isArchived={campaign.archivedAt !== null}
              />
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">
                {format(new Date(campaign.createdAt), "dd MMMM yyyy, HH:mm", { locale: localeId })}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{campaign.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {campaign.dispatchStatus === "DRAFT" && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit(campaign.id)}
                className="text-xs"
              >
                Ubah Draft
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSend}
                className="text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim Sekarang
              </Button>
            </>
          )}

          {(campaign.dispatchStatus === "SCHEDULED" || campaign.dispatchStatus === "QUEUED") && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleCancel}
              className="text-xs flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              Batalkan Pengiriman
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadData}
            title="Segarkan Data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
          </Button>
        </div>
      </div>

      {/* Main Campaign Details Card */}
      <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Saluran:</span>
            {campaign.channels.map((ch) => (
              <NotificationChannelBadge key={ch} channel={ch} />
            ))}
          </div>

          {campaign.scheduledAt && (
            <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>
                Jadwal:{" "}
                {format(new Date(campaign.scheduledAt), "dd MMMM yyyy, HH:mm", {
                  locale: localeId,
                })}
              </span>
            </div>
          )}
        </div>

        {/* Rich Text Content */}
        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-lg">
          <RichTextViewer content={campaign.contentJson} />
        </div>

        {/* Push Summary Note */}
        {campaign.pushSummary && (
          <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-lg text-xs text-indigo-950">
            <strong>Ringkasan Push:</strong> {campaign.pushSummary}
          </div>
        )}
      </div>

      {/* Delivery Reports Section */}
      <NotificationDeliveryTable
        deliveries={deliveries}
        total={totalDeliveries}
        summary={summary}
        currentPage={page}
        pageSize={20}
        onPageChange={setPage}
        onRetryFailed={handleRetryFailed}
        retrying={retrying}
      />
    </div>
  );
}
