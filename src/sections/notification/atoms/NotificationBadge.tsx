"use client";

interface NotificationBadgeProps {
  count: number;
}

export default function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      aria-label={`${count} notifikasi belum dibaca`}
      className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#151521] leading-none"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
