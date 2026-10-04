"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { request } from "@/libs/apiClient";
import type { NotificationTab } from "@/modules/notification/domain/types/NotificationTypes";
import type {
  PaginatedNotificationsResponseDto,
  UnreadCountResponseDto,
} from "@/modules/notification/domain/dto/NotificationResponseDto";

const POLL_INTERVAL_MS = 30_000;
const DEFAULT_LIMIT = 10;

export function useNotificationApi() {
  // ── Unread count (for badge) ──────────────────────────────────────────
  const [unreadCount, setUnreadCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    const res = await request<UnreadCountResponseDto>(
      "/api/notifications/count",
      { method: "GET" },
    );
    if (!res.error && res.data !== null) {
      setUnreadCount(res.data.unreadCount);
    }
  }, []);

  // Start/stop polling
  useEffect(() => {
    setCountLoading(true);
    void fetchUnreadCount().finally(() => setCountLoading(false));
    pollRef.current = setInterval(() => void fetchUnreadCount(), POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchUnreadCount]);

  // ── Paginated list ────────────────────────────────────────────────────
  const [listState, setListState] = useState<{
    data: PaginatedNotificationsResponseDto | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: false, error: null });

  const [activeTab, setActiveTab] = useState<NotificationTab>("unread");
  const [page, setPage] = useState(1);

  const fetchNotifications = useCallback(
    async (tab: NotificationTab, p: number) => {
      setListState((prev) => ({ ...prev, loading: true, error: null }));
      const res = await request<PaginatedNotificationsResponseDto>(
        `/api/notifications?tab=${tab}&page=${p}&limit=${DEFAULT_LIMIT}`,
        { method: "GET" },
      );

      if (res.error || !res.data) {
        setListState({
          data: null,
          loading: false,
          error: res.error ?? "Gagal memuat notifikasi.",
        });
        return;
      }

      setListState({ data: res.data, loading: false, error: null });
    },
    [],
  );

  const switchTab = useCallback(
    (tab: NotificationTab) => {
      setActiveTab(tab);
      setPage(1);
      void fetchNotifications(tab, 1);
    },
    [fetchNotifications],
  );

  const goToPage = useCallback(
    (p: number) => {
      setPage(p);
      void fetchNotifications(activeTab, p);
    },
    [activeTab, fetchNotifications],
  );

  // ── Mark as read (single) ────────────────────────────────────────────
  const markAsRead = useCallback(
    async (notificationId: string) => {
      await request(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
      // Optimistic: decrement badge and refresh list
      setUnreadCount((c) => Math.max(0, c - 1));
      void fetchNotifications(activeTab, page);
    },
    [activeTab, page, fetchNotifications],
  );

  // ── Mark all as read ─────────────────────────────────────────────────
  const markAllAsRead = useCallback(async () => {
    await request("/api/notifications", { method: "PATCH" });
    setUnreadCount(0);
    void fetchNotifications("unread", 1);
    setPage(1);
  }, [fetchNotifications]);

  // Load initial list when panel is opened (called externally)
  const openPanel = useCallback(() => {
    setActiveTab("unread");
    setPage(1);
    void fetchNotifications("unread", 1);
  }, [fetchNotifications]);

  return {
    // Badge
    unreadCount,
    countLoading,
    // Panel list
    listState,
    activeTab,
    page,
    // Actions
    switchTab,
    goToPage,
    markAsRead,
    markAllAsRead,
    openPanel,
    fetchUnreadCount,
  };
}
