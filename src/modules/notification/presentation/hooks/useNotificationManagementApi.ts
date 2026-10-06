// Files: src/modules/notification/presentation/hooks/useNotificationManagementApi.ts
"use client";

import { useCallback, useState } from "react";
import type {
  CreateNotificationCampaignRequestDto,
  UpdateNotificationCampaignRequestDto,
} from "@/modules/notification/domain/dto/NotificationCampaignRequestDto";
import type {
  NotificationAudiencePreviewResponseDto,
  NotificationCampaignResponseDto,
  NotificationDeliveryItemDto,
  NotificationRecipientOptionsResponseDto,
} from "@/modules/notification/domain/dto/NotificationCampaignResponseDto";
import type {
  NotificationAudienceSpec,
  NotificationDeliverySummary,
} from "@/modules/notification/domain/types/NotificationTypes";

export function useNotificationManagementApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<NotificationCampaignResponseDto[]>([]);
  const [total, setTotal] = useState(0);

  const fetchCampaigns = useCallback(
    async (params?: {
      search?: string;
      status?: string;
      isArchived?: boolean;
      page?: number;
      limit?: number;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams();
        if (params?.search) qs.set("search", params.search);
        if (params?.status && params.status !== "ALL") qs.set("status", params.status);
        if (params?.isArchived !== undefined) qs.set("isArchived", String(params.isArchived));
        if (params?.page) qs.set("page", String(params.page));
        if (params?.limit) qs.set("limit", String(params.limit));

        const res = await fetch(`/api/notification-management/campaigns?${qs.toString()}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error?.message || "Gagal memuat daftar pengumuman.");
        }
        setCampaigns(json.data.items);
        setTotal(json.data.total);
        return json.data;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
        setError(msg);
        return { items: [], total: 0 };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchCampaign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notification-management/campaigns/${id}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Gagal memuat detail pengumuman.");
      }
      return json.data as NotificationCampaignResponseDto;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCampaign = useCallback(async (dto: CreateNotificationCampaignRequestDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notification-management/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Gagal membuat pengumuman.");
      }
      return json.data as NotificationCampaignResponseDto;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCampaign = useCallback(
    async (id: string, dto: UpdateNotificationCampaignRequestDto) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/notification-management/campaigns/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error?.message || "Gagal memperbarui pengumuman.");
        }
        return json.data as NotificationCampaignResponseDto;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteDraft = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notification-management/campaigns/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Gagal menghapus draft.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const previewAudience = useCallback(async (audienceSpec: NotificationAudienceSpec) => {
    try {
      const res = await fetch("/api/notification-management/campaigns/dummy/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audienceSpec }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Gagal memeriksa audiens.");
      }
      return json.data as NotificationAudiencePreviewResponseDto;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(msg);
      throw err;
    }
  }, []);

  const fetchRecipientOptions = useCallback(async () => {
    try {
      const res = await fetch("/api/notification-management/recipients");
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Gagal memuat opsi penerima.");
      }
      return json.data as NotificationRecipientOptionsResponseDto;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(msg);
      throw err;
    }
  }, []);

  const sendCampaign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notification-management/campaigns/${id}/send`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Gagal mengirim pengumuman.");
      }
      return json.data as NotificationCampaignResponseDto;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleCampaign = useCallback(
    async (id: string, scheduledAt: string, timezone?: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/notification-management/campaigns/${id}/schedule`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scheduledAt, timezone }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error?.message || "Gagal menjadwalkan pengumuman.");
        }
        return json.data as NotificationCampaignResponseDto;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const cancelCampaign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notification-management/campaigns/${id}/cancel`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Gagal membatalkan pengumuman.");
      }
      return json.data as NotificationCampaignResponseDto;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const archiveCampaign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notification-management/campaigns/${id}/archive`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Gagal mengarsipkan pengumuman.");
      }
      return json.data as NotificationCampaignResponseDto;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const retryDelivery = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notification-management/campaigns/${id}/retry`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Gagal mengulang pengiriman.");
      }
      return json.data as { retriedCount: number };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeliveryReport = useCallback(async (id: string, page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/notification-management/campaigns/${id}/deliveries?page=${page}&limit=${limit}`,
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Gagal memuat laporan pengiriman.");
      }
      return json.data as {
        items: NotificationDeliveryItemDto[];
        total: number;
        summary: NotificationDeliverySummary;
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    campaigns,
    total,
    fetchCampaigns,
    fetchCampaign,
    createCampaign,
    updateCampaign,
    deleteDraft,
    previewAudience,
    fetchRecipientOptions,
    sendCampaign,
    scheduleCampaign,
    cancelCampaign,
    archiveCampaign,
    retryDelivery,
    fetchDeliveryReport,
  };
}
