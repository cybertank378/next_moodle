// Files: src/app/(admin)/admin/notifications/page.tsx
import type { Metadata } from "next";
import NotificationManagementPageView from "@/sections/notification-management/pages/NotificationManagementPageView";

export const metadata: Metadata = {
  title: "Pengelolaan Notifikasi | Admin",
  description: "Kelola pengumuman dan notifikasi push untuk seluruh platform dan tenant.",
};

export default function AdminNotificationsPage() {
  return <NotificationManagementPageView role="ADMIN" />;
}
