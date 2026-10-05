// Files: src/sections/notification-management/atoms/NotificationChannelBadge.tsx

import { NotificationChannel } from "@/modules/notification/domain/types/NotificationTypes";
import { Inbox, Bell } from "lucide-react";
import clsx from "clsx";

interface Props {
  channel: NotificationChannel | string;
}

export default function NotificationChannelBadge({ channel }: Props) {
  if (channel === NotificationChannel.IN_APP) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
        <Inbox className="w-3 h-3 text-slate-500" />
        Inbox
      </span>
    );
  }

  if (channel === NotificationChannel.PUSH) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
        <Bell className="w-3 h-3 text-indigo-500" />
        Push FCM
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
      {channel}
    </span>
  );
}
