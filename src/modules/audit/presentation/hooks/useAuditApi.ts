"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AuditQuery } from "@/modules/audit/domain/builder/AuditQueryBuilder";
import type {
  AuditDetailDTO,
  AuditListResponseDTO,
} from "@/modules/audit/domain/dto/AuditResponseDTO";

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}
async function get<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    credentials: "same-origin",
    cache: "no-store",
    signal,
  });
  const body = (await response.json()) as Envelope<T>;
  if (!response.ok || !body.success || !body.data)
    throw new Error(body.error?.message ?? "Gagal mengambil data audit.");
  return body.data;
}

export interface AuditRetentionOverviewData {
  protectedCount: number;
  eligibleCount: number;
  cutoff: string;
  asOf: string;
}

const EMPTY_AUDIT_LIST: AuditListResponseDTO = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 25,
  totalPages: 0,
  statistics: { total: 0, admin: 0, tenant: 0, today: 0 },
  scope: { role: "TENANT", tenantId: null },
  fetchedAt: "",
};

export function useAuditApi(
  initialData?: AuditListResponseDTO,
  initialQuery?: AuditQuery,
) {
  const [data, setData] = useState<AuditListResponseDTO>(
    initialData ?? EMPTY_AUDIT_LIST,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<AuditDetailDTO | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const listAbort = useRef<AbortController | null>(null);
  const detailAbort = useRef<AbortController | null>(null);
  const last = useRef(Date.now());
  const seq = useRef(0);
  const refresh = useCallback(async () => {
    if (!initialQuery) return;
    listAbort.current?.abort();
    const controller = new AbortController();
    listAbort.current = controller;
    const id = ++seq.current;
    setLoading(true);
    setError(null);
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(initialQuery))
      if (v !== undefined && v !== "") p.set(k, String(v));
    try {
      const next = await get<AuditListResponseDTO>(
        `/api/audit?${p}`,
        controller.signal,
      );
      if (!controller.signal.aborted && seq.current === id) {
        setData(next);
        last.current = Date.now();
      }
    } catch (e) {
      if (!controller.signal.aborted && seq.current === id)
        setError(e instanceof Error ? e.message : "Gagal mengambil log audit.");
    } finally {
      if (seq.current === id && !controller.signal.aborted) setLoading(false);
    }
  }, [initialQuery]);
  const loadDetail = useCallback(async (id: string) => {
    detailAbort.current?.abort();
    const controller = new AbortController();
    detailAbort.current = controller;
    setDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    try {
      const item = await get<AuditDetailDTO>(
        `/api/audit/${encodeURIComponent(id)}`,
        controller.signal,
      );
      if (!controller.signal.aborted) setDetail(item);
    } catch (e) {
      if (!controller.signal.aborted)
        setDetailError(
          e instanceof Error ? e.message : "Detail tidak tersedia.",
        );
    } finally {
      if (!controller.signal.aborted) setDetailLoading(false);
    }
  }, []);
  const closeDetail = useCallback(() => {
    detailAbort.current?.abort();
    setDetail(null);
    setDetailError(null);
    setDetailLoading(false);
  }, []);

  const getRetentionOverview =
    useCallback(async (): Promise<AuditRetentionOverviewData> => {
      const res = await fetch("/api/audit/retention", {
        credentials: "same-origin",
        cache: "no-store",
      });
      const body = (await res.json()) as Envelope<AuditRetentionOverviewData>;
      if (!res.ok || !body.success || !body.data) {
        throw new Error(
          body.error?.message ?? "Gagal memuat data retensi audit.",
        );
      }
      return body.data;
    }, []);

  const cleanupRetention = useCallback(async (): Promise<{
    deleted: number;
  }> => {
    const res = await fetch("/api/audit/cleanup", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
    });
    const body = (await res.json()) as Envelope<{ deleted: number }>;
    if (!res.ok || !body.success || !body.data) {
      throw new Error(body.error?.message ?? "Pembersihan log audit gagal.");
    }
    return body.data;
  }, []);

  useEffect(() => {
    if (!initialQuery) return;
    const onFocus = () => {
      if (
        document.visibilityState !== "visible" ||
        Date.now() - last.current < 30000
      )
        return;
      last.current = Date.now();
      void refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      listAbort.current?.abort();
      detailAbort.current?.abort();
    };
  }, [refresh, initialQuery]);

  return {
    data,
    loading,
    error,
    detail,
    detailError,
    detailLoading,
    refresh,
    loadDetail,
    closeDetail,
    getRetentionOverview,
    cleanupRetention,
  };
}
