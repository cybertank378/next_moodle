"use client";

import { BellOff } from "lucide-react";
import type { NotificationResponseDto } from "@/modules/notification/domain/dto/NotificationResponseDto";
import type { NotificationTab } from "@/modules/notification/domain/types/NotificationTypes";
import Pagination from "@/shared-ui/component/Pagination";
import Skeleton from "@/shared-ui/component/Skeleton";
import NotificationItem from "@/sections/notification/atoms/NotificationItem";

interface NotificationListProps {
  items: NotificationResponseDto[];
  loading: boolean;
  error: string | null;
  tab: NotificationTab;
  page: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNotificationClick: (notification: NotificationResponseDto) => void;
}

export default function NotificationList({
  items,
  loading,
  error,
  tab,
  page,
  total,
  totalPages,
  onPageChange,
  onNotificationClick,
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-sm text-rose-500">
        <p>{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        data-testid="notification-empty"
        className="flex flex-col items-center justify-center py-10 gap-3 text-center"
      >
        <div className="w-10 h-10 rounded-full bg-slate-100  flex items-center justify-center">
          <BellOff size={20} className="text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600 ">
          {tab === "unread"
            ? "Tidak ada notifikasi baru"
            : "Tidak ada notifikasi yang telah dibaca"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="divide-y divide-slate-100 ">
        {items.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={onNotificationClick}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="border-t border-slate-100  px-4 py-3">
          <Pagination
            currentPage={page}
            totalItems={total}
            itemsPerPage={10}
            onPageChangeAction={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
