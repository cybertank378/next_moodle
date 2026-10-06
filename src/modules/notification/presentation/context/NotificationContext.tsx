// Files: src/modules/notification/presentation/context/NotificationContext.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { MessagePayload, Messaging } from "firebase/messaging";
import { request } from "@/libs/apiClient";
import type {
  PaginatedNotificationsResponseDto,
  UnreadCountResponseDto,
} from "@/modules/notification/domain/dto/NotificationResponseDto";
import type { NotificationTab } from "@/modules/notification/domain/types/NotificationTypes";

const POLL_INTERVAL_MS = 30_000;
const DEFAULT_LIMIT = 10;

export type PushPermissionStatus = "default" | "granted" | "denied" | "unsupported";

export interface NotificationContextValue {
  // Badge & Count
  unreadCount: number;
  countLoading: boolean;

  // List & Tabs
  listState: {
    data: PaginatedNotificationsResponseDto | null;
    loading: boolean;
    error: string | null;
  };
  activeTab: NotificationTab;
  page: number;

  // Push State
  pushPermission: PushPermissionStatus;
  pushLoading: boolean;
  pushError: string | null;

  // Actions
  fetchUnreadCount: () => Promise<void>;
  fetchNotifications: (tab: NotificationTab, p: number) => Promise<void>;
  switchTab: (tab: NotificationTab) => void;
  goToPage: (p: number) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  openPanel: () => void;
  requestPushPermission: () => Promise<void>;
  unregisterPush: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export interface NotificationProviderProps {
  children: React.ReactNode;
  userKey?: string;
}

export function NotificationProvider({ children, userKey }: NotificationProviderProps) {
  // ── 1. Unread count state ──
  const [unreadCount, setUnreadCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);

  // ── 2. List state ──
  const [listState, setListState] = useState<{
    data: PaginatedNotificationsResponseDto | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: false, error: null });

  const [activeTab, setActiveTab] = useState<NotificationTab>("unread");
  const [page, setPage] = useState(1);

  // Keep refs for asynchronous access without closure staleness
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;
  const pageRef = useRef(page);
  pageRef.current = page;

  // Request sequencing to prevent out-of-order race conditions
  const requestIdRef = useRef(0);

  // ── 3. Push permission & device state ──
  const [pushPermission, setPushPermission] = useState<PushPermissionStatus>(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission as PushPermissionStatus;
    }
    return "unsupported";
  });
  const [pushLoading, setPushLoading] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);

  const deviceTokenRef = useRef<string | null>(null);
  const processedMessageIdsRef = useRef<Set<string>>(new Set());
  const unsubscribeForegroundRef = useRef<(() => void) | null>(null);

  // ── 4. Fetch unread count ──
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await request<UnreadCountResponseDto>("/api/notifications/count", {
        method: "GET",
      });
      if (!res.error && res.data !== null) {
        setUnreadCount(res.data.unreadCount);
      }
    } catch {
      // Ignore background network failure
    }
  }, []);

  // ── 5. Fetch notifications with request sequencing ──
  const fetchNotifications = useCallback(
    async (tab: NotificationTab, p: number) => {
      const currentReqId = ++requestIdRef.current;
      setListState((prev) => ({ ...prev, loading: true, error: null }));

      const res = await request<PaginatedNotificationsResponseDto>(
        `/api/notifications?tab=${tab}&page=${p}&limit=${DEFAULT_LIMIT}`,
        { method: "GET" },
      );

      // Discard stale response if a newer request was dispatched
      if (currentReqId !== requestIdRef.current) {
        return;
      }

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
      void fetchNotifications(activeTabRef.current, p);
    },
    [fetchNotifications],
  );

  // ── 6. Idempotent Mark as Read with Optimistic Rollback ──
  const markAsRead = useCallback(
    async (notificationId: string) => {
      // Idempotency: verify if already read
      const currentItem = listState.data?.items.find((item) => item.id === notificationId);
      if (currentItem && currentItem.isRead) {
        return;
      }

      // Snapshot for optimistic rollback
      const prevCount = unreadCount;
      const prevData = listState.data;

      // Optimistic update
      setUnreadCount((c) => Math.max(0, c - 1));
      setListState((prev) => {
        if (!prev.data) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            items: prev.data.items.map((item) =>
              item.id === notificationId ? { ...item, isRead: true } : item,
            ),
          },
        };
      });

      const res = await request(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });

      if (res.error) {
        // Rollback on failure
        setUnreadCount(prevCount);
        setListState((prev) => ({
          ...prev,
          data: prevData,
          error: "Gagal menandai notifikasi sebagai dibaca. Coba lagi.",
        }));
      } else {
        // Refresh notifications to sync tab status
        void fetchNotifications(activeTabRef.current, pageRef.current);
      }
    },
    [unreadCount, listState.data, fetchNotifications],
  );

  // ── 7. Mark All as Read with Optimistic Rollback ──
  const markAllAsRead = useCallback(async () => {
    const prevCount = unreadCount;
    const prevData = listState.data;

    // Optimistic update
    setUnreadCount(0);
    setListState((prev) => {
      if (!prev.data) return prev;
      return {
        ...prev,
        data: {
          ...prev.data,
          items: prev.data.items.map((item) => ({ ...item, isRead: true })),
        },
      };
    });

    const res = await request("/api/notifications", { method: "PATCH" });

    if (res.error) {
      // Rollback on failure
      setUnreadCount(prevCount);
      setListState((prev) => ({
        ...prev,
        data: prevData,
        error: "Gagal menandai semua notifikasi sebagai dibaca. Coba lagi.",
      }));
    } else {
      // Ensure tab consistency: if viewing unread, reset to page 1
      setActiveTab("unread");
      setPage(1);
      void fetchNotifications("unread", 1);
    }
  }, [unreadCount, listState.data, fetchNotifications]);

  const openPanel = useCallback(() => {
    setActiveTab("unread");
    setPage(1);
    void fetchNotifications("unread", 1);
  }, [fetchNotifications]);

  // ── 8. Coordinated Push Setup & Foreground Message Listener ──
  const setupForegroundListener = useCallback((messaging: Messaging) => {
    if (unsubscribeForegroundRef.current) {
      unsubscribeForegroundRef.current();
    }

    import("@/libs/firebase").then(({ onMessage }) => {
      unsubscribeForegroundRef.current = onMessage(messaging, (payload: MessagePayload) => {
        if (!payload?.data) return;

        const notifId = payload.data.id;
        // Deduplicate incoming foreground messages
        if (notifId && processedMessageIdsRef.current.has(notifId)) {
          return;
        }
        if (notifId) {
          processedMessageIdsRef.current.add(notifId);
        }

        // Coordinate state update: refetch count accurately
        void fetchUnreadCount();

        // Refresh list if user is viewing unread on page 1
        if (activeTabRef.current === "unread" && pageRef.current === 1) {
          void fetchNotifications("unread", 1);
        }
      });
    });
  }, [fetchUnreadCount, fetchNotifications]);

  const registerToken = useCallback(
    async (token: string) => {
      deviceTokenRef.current = token;
      await request("/api/firebase/subscribe", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
    },
    [],
  );

  // Explicit user action to request push permission
  const requestPushPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPushPermission("unsupported");
      return;
    }

    setPushLoading(true);
    setPushError(null);

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission as PushPermissionStatus);

      if (permission === "granted") {
        const { initMessaging, getToken } = await import("@/libs/firebase");
        const messaging = await initMessaging();
        if (messaging) {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });
          if (token) {
            await registerToken(token);
            setupForegroundListener(messaging);
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengaktifkan notifikasi push";
      setPushError(msg);
    } finally {
      setPushLoading(false);
    }
  }, [registerToken, setupForegroundListener]);

  // Unregister token upon logout / session switch
  const unregisterPush = useCallback(async () => {
    if (deviceTokenRef.current) {
      try {
        await request("/api/firebase/subscribe", {
          method: "DELETE",
          body: JSON.stringify({ token: deviceTokenRef.current }),
        });
      } catch {
        // ignore logout network issues
      }
      deviceTokenRef.current = null;
    }
    if (unsubscribeForegroundRef.current) {
      unsubscribeForegroundRef.current();
      unsubscribeForegroundRef.current = null;
    }
  }, []);

  // ── 9. Session Reset & Visibility-Aware Polling ──
  useEffect(() => {
    // Reset state when userKey / session changes
    setUnreadCount(0);
    setListState({ data: null, loading: false, error: null });
    processedMessageIdsRef.current.clear();

    setCountLoading(true);
    void fetchUnreadCount().finally(() => setCountLoading(false));

    // If permission was already granted prior, passively wire messaging
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      void (async () => {
        try {
          const { initMessaging, getToken } = await import("@/libs/firebase");
          const messaging = await initMessaging();
          if (messaging) {
            const token = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            if (token) {
              await registerToken(token);
              setupForegroundListener(messaging);
            }
          }
        } catch {
          // Passive registration error ignored
        }
      })();
    }

    // Visibility-aware single polling
    const pollInterval = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) {
        return; // Pause polling when tab is hidden
      }
      void fetchUnreadCount();
    }, POLL_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && !document.hidden) {
        void fetchUnreadCount();
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      clearInterval(pollInterval);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
      if (unsubscribeForegroundRef.current) {
        unsubscribeForegroundRef.current();
        unsubscribeForegroundRef.current = null;
      }
    };
  }, [userKey, fetchUnreadCount, registerToken, setupForegroundListener]);

  const value: NotificationContextValue = {
    unreadCount,
    countLoading,
    listState,
    activeTab,
    page,
    pushPermission,
    pushLoading,
    pushError,
    fetchUnreadCount,
    fetchNotifications,
    switchTab,
    goToPage,
    markAsRead,
    markAllAsRead,
    openPanel,
    requestPushPermission,
    unregisterPush,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationContext must be used within a NotificationProvider");
  }
  return context;
}
