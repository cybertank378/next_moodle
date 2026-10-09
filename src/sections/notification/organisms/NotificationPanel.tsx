// Files: src/sections/notification/organisms/NotificationPanel.tsx
"use client";

import { CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ROUTES } from "@/libs/routes";
import type { NotificationResponseDto } from "@/modules/notification/domain/dto/NotificationResponseDto";
import { useNotificationApi } from "@/modules/notification/presentation/hooks/useNotificationApi";
import NotificationList from "@/sections/notification/molecules/NotificationList";
import NotificationTabBar from "@/sections/notification/molecules/NotificationTabBar";
import Button from "@/shared-ui/component/Button";
import { showErrorToast } from "@/shared-ui/component/Toast";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({
  isOpen,
  onClose,
}: NotificationPanelProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    unreadCount,
    listState,
    activeTab,
    page,
    pushPermission,
    pushLoading,
    switchTab,
    goToPage,
    markAsRead,
    markAllAsRead,
    openPanel,
    requestPushPermission,
  } = useNotificationApi();

  // Load notifications when panel opens
  useEffect(() => {
    if (isOpen) openPanel();
  }, [isOpen, openPanel]);

  useEffect(() => {
    if (listState.error) {
      showErrorToast(listState.error);
    }
  }, [listState.error]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleNotificationClick = async (
    notification: NotificationResponseDto,
  ) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    onClose();
    if (
      notification.linkPath &&
      notification.linkPath.startsWith("/") &&
      !notification.linkPath.startsWith("//")
    ) {
      router.push(notification.linkPath);
    }
  };

  const handleMarkAllAsRead = () => {
    void markAllAsRead();
  };

  const handleRequestPushPermission = () => {
    void requestPushPermission();
  };

  const handleNavigateToAllNotifications = () => {
    onClose();
    router.push(ROUTES.DASHBOARD.NOTIFICATIONS);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      id="notification-panel"
      role="region"
      aria-label="Panel Notifikasi"
      data-testid="notification-panel"
      className="absolute right-0 top-full mt-2 w-[min(360px,calc(100vw-24px))] sm:w-[360px] max-h-[560px] flex flex-col bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h2 className="text-sm font-semibold text-slate-900">
          Notifikasi
        </h2>
        {unreadCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-testid="mark-all-read-btn"
            leftIcon={CheckCheck}
            onClick={handleMarkAllAsRead}
            className="text-xs text-indigo-600 hover:text-indigo-800 h-7 px-2"
          >
            Tandai semua dibaca
          </Button>
        )}
      </div>

      {/* ── Push Permission Prompt (Explicit Action) ── */}
      {pushPermission === "default" && (
        <div className="px-3.5 py-2.5 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-900 gap-2">
          <span className="leading-snug">
            Aktifkan notifikasi untuk menerima info terbaru langsung di browser.
          </span>
          <Button
            type="button"
            variant="filled"
            color="primary"
            size="sm"
            loading={pushLoading}
            onClick={handleRequestPushPermission}
            className="shrink-0 text-xs py-1 px-2.5"
          >
            Aktifkan
          </Button>
        </div>
      )}

      {/* ── Tabs ── */}
      <NotificationTabBar
        activeTab={activeTab}
        unreadCount={unreadCount}
        onTabChange={switchTab}
      />

      {/* ── List ── */}
      <div className="overflow-y-auto flex-1">
        <NotificationList
          items={listState.data?.items ?? []}
          loading={listState.loading}
          error={listState.error}
          tab={activeTab}
          page={page}
          total={listState.data?.total ?? 0}
          totalPages={listState.data?.totalPages ?? 1}
          onPageChange={goToPage}
          onNotificationClick={(n) => void handleNotificationClick(n)}
        />
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-slate-200 bg-slate-50 p-2 text-center">
        <Button
          type="button"
          variant="ghost"
          color="primary"
          size="sm"
          fullWidth
          onClick={handleNavigateToAllNotifications}
          className="text-xs font-semibold"
        >
          Lihat semua notifikasi
        </Button>
      </div>
    </div>
  );
}
