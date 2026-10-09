"use client";

import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  FileText,
  Info,
  MailCheck,
  UserPlus,
} from "lucide-react";
import type { NotificationResponseDto } from "@/modules/notification/domain/dto/NotificationResponseDto";
import { NotificationType } from "@/modules/notification/domain/types/NotificationTypes";
import Button from "@/shared-ui/component/Button";

interface NotificationItemProps {
  notification: NotificationResponseDto;
  onClick: (notification: NotificationResponseDto) => void;
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.EXAM_RESULT_AVAILABLE:
      return <CheckCircle size={16} className="text-emerald-500" />;
    case NotificationType.ASSIGNMENT_SUBMITTED:
      return <FileText size={16} className="text-indigo-500" />;
    case NotificationType.ASSIGNMENT_GRADED:
      return <BookOpen size={16} className="text-blue-500" />;
    case NotificationType.STUDENT_ENROLLED:
      return <UserPlus size={16} className="text-teal-500" />;
    case NotificationType.STUDENT_IMPORT_COMPLETE:
      return <MailCheck size={16} className="text-green-500" />;
    case NotificationType.STUDENT_IMPORT_FAILED:
      return <AlertCircle size={16} className="text-rose-500" />;
    case NotificationType.TENANT_REGISTERED:
      return <UserPlus size={16} className="text-violet-500" />;
    case NotificationType.CREDENTIAL_FAILED:
      return <AlertCircle size={16} className="text-orange-500" />;
    case NotificationType.SYSTEM_ERROR:
      return <AlertCircle size={16} className="text-red-500" />;
    default:
      return <Info size={16} className="text-slate-400" />;
  }
}

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit yang lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari yang lalu`;
}

export default function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const handleClick = () => {
    onClick(notification);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      fullWidth
      data-testid={`notification-item-${notification.id}`}
      onClick={handleClick}
      className={[
        "w-full text-left px-4 py-3 flex gap-3 transition-colors hover:bg-slate-50 rounded-none h-auto justify-start font-normal items-start",
        !notification.isRead
          ? "bg-indigo-50/60 border-l-2 border-indigo-500"
          : "border-l-2 border-transparent",
      ].join(" ")}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
        {getNotificationIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={[
            "text-sm leading-snug",
            !notification.isRead
              ? "font-semibold text-slate-900"
              : "font-normal text-slate-700",
          ].join(" ")}
        >
          {notification.title}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
          {notification.body}
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-indigo-500" />
      )}
    </Button>
  );
}
