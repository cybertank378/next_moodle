"use client";

import { CheckCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { NotificationResponseDto } from "@/modules/notification/domain/dto/NotificationResponseDto";
import { useNotificationApi } from "@/modules/notification/presentation/hooks/useNotificationApi";
import NotificationTabBar from "../molecules/NotificationTabBar";
import NotificationList from "../molecules/NotificationList";

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
    switchTab,
    goToPage,
    markAsRead,
    markAllAsRead,
    openPanel,
  } = useNotificationApi();

  // Load notifications when panel opens
  useEffect(() => {
    if (isOpen) openPanel();
  }, [isOpen, openPanel]);

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

  const handleNotificationClick = async (
    notification: NotificationResponseDto,
  ) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    onClose();
    if (notification.linkPath) {
      router.push(notification.linkPath);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      data-testid="notification-panel"
      className="absolute right-0 top-full mt-2 w-[360px] max-h-[560px] flex flex-col bg-white dark:bg-[#1e1e2d] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151521]">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Notifikasi
        </h2>
        {unreadCount > 0 && (
          <button
            type="button"
            data-testid="mark-all-read-btn"
            onClick={() => void markAllAsRead()}
            className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
          >
            <CheckCheck size={14} />
            Tandai semua dibaca
          </button>
        )}
      </div>

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
    </div>
  );
}
