// Files: src/sections/notification-management/atoms/NotificationChannelBadge.tsx

import { NotificationChannel } from "@/modules/notification/domain/types/NotificationTypes";

interface Props {
  channel: NotificationChannel | string;
}

export default function NotificationChannelBadge({ channel }: Props) {
  if (channel === NotificationChannel.IN_APP) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100">
        Inbox
      </span>
    );
  }

  if (channel === NotificationChannel.PUSH) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100">
        Push
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
      {channel}
    </span>
  );
}
