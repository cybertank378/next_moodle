// Files: src/app/(tenant)/tenant/notifications/page.tsx
import type { Metadata } from "next";
import NotificationManagementPageView from "@/sections/notification-management/pages/NotificationManagementPageView";

export const metadata: Metadata = {
  title: "Pengumuman & Notifikasi | Tenant",
  description: "Kelola pengumuman sekolah dan notifikasi push untuk siswa dan guru.",
};

export default function TenantNotificationsPage() {
  return <NotificationManagementPageView role="TENANT" />;
}
