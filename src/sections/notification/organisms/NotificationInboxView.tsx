// Files: src/sections/notification/organisms/NotificationInboxView.tsx
"use client";

import { Bell, CheckCheck, RefreshCw, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APP_NAME } from "@/libs/branding";
import type { UserRole } from "@/libs/enums";
import type { NotificationResponseDto } from "@/modules/notification/domain/dto/NotificationResponseDto";
import { useNotificationApi } from "@/modules/notification/presentation/hooks/useNotificationApi";
import NotificationDetailModal from "@/sections/notification/molecules/NotificationDetailModal";
import NotificationList from "@/sections/notification/molecules/NotificationList";
import NotificationTabBar from "@/sections/notification/molecules/NotificationTabBar";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import { showErrorToast } from "@/shared-ui/component/Toast";

interface NotificationInboxViewProps {
  userRole?: UserRole;
}

export default function NotificationInboxView({
  userRole,
}: NotificationInboxViewProps) {
  const router = useRouter();
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationResponseDto | null>(null);

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
    fetchNotifications,
    requestPushPermission,
  } = useNotificationApi();

  useEffect(() => {
    void fetchNotifications(activeTab, page);
  }, [fetchNotifications, activeTab, page]);

  useEffect(() => {
    if (listState.error) {
      showErrorToast(listState.error);
    }
  }, [listState.error]);

  const handleNotificationClick = async (
    notification: NotificationResponseDto,
  ) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    if (
      notification.linkPath?.startsWith("/") &&
      !notification.linkPath.startsWith("//")
    ) {
      router.push(notification.linkPath);
    } else {
      setSelectedNotification(notification);
    }
  };

  const handleRefresh = () => {
    void fetchNotifications(activeTab, page);
  };

  const handleMarkAllAsRead = () => {
    void markAllAsRead();
  };

  const handleRequestPushPermission = () => {
    void requestPushPermission();
  };

  const roleLabel =
    userRole === "STUDENT"
      ? "Siswa"
      : userRole === "TEACHER"
        ? "Guru"
        : userRole === "TENANT"
          ? "Admin Sekolah"
          : "Pengguna";

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <span>
          {APP_NAME} / {roleLabel} / Notifikasi
        </span>
      </div>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-xs">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Notifikasi
              </h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                  {unreadCount} baru
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Kotak masuk informasi, pengumuman, dan aktivitas terkini Anda.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <Button
              type="button"
              variant="outline"
              color="primary"
              size="sm"
              leftIcon={CheckCheck}
              onClick={handleMarkAllAsRead}
            >
              Tandai semua dibaca
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            color="secondary"
            size="sm"
            leftIcon={RefreshCw}
            loading={listState.loading}
            onClick={handleRefresh}
            aria-label="Segarkan notifikasi"
          >
            Segarkan
          </Button>
        </div>
      </div>

      {/* ── Push Notification Banner (Explicit Action) ── */}
      {pushPermission === "default" && (
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl mt-0.5 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Aktifkan Notifikasi Browser
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Dapatkan pemberitahuan langsung saat ada pengumuman ujian, hasil
                nilai, atau pesan baru tanpa harus selalu membuka website.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="filled"
            color="primary"
            size="sm"
            loading={pushLoading}
            onClick={handleRequestPushPermission}
          >
            Aktifkan Sekarang
          </Button>
        </div>
      )}

      {/* ── Main Notification Card ── */}
      <Card className="p-0 overflow-hidden shadow-sm border border-slate-200/80">
        <NotificationTabBar
          activeTab={activeTab}
          unreadCount={unreadCount}
          onTabChange={switchTab}
        />

        <div className="p-2 sm:p-4">
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
      </Card>

      {/* ── Notification Detail Modal ── */}
      <NotificationDetailModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </div>
  );
}
