import type { Metadata } from "next";
import AdminDashboardPage from "@/sections/dashboard/pages/AdminDashboardPage";

export const metadata: Metadata = {
  title: "Platform Overview | Admin",
  description: "Ringkasan platform SaaS: status tenant, pertumbuhan, dan tenant terbaru.",
};

export default function AdminDashboard() {
  return <AdminDashboardPage />;
}
