// Files: src/sections/notification-management/molecules/NotificationManagementHeader.tsx
"use client";

import { Bell, Plus, RefreshCw } from "lucide-react";
import Button from "@/shared-ui/component/Button";

interface Props {
  role: "ADMIN" | "TENANT";
  onNewCampaign: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export default function NotificationManagementHeader({
  role,
  onNewCampaign,
  onRefresh,
  loading = false,
}: Props) {
  const roleName = role === "ADMIN" ? "Platform" : "Sekolah";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-medium text-slate-500">
            {role === "ADMIN" ? "Admin" : "Tenant"} / Pengumuman & Notifikasi
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
            MANAJEMEN NOTIFIKASI
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <Bell className="w-6 h-6 text-indigo-600" />
          Pengelolaan Pengumuman & Notifikasi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kirim pengumuman ke inbox dan notifikasi push perangkat untuk {roleName}.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Segarkan data pengumuman"
          title="Segarkan data pengumuman"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onNewCampaign}
          className="flex items-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Buat Pengumuman Baru
        </Button>
      </div>
    </div>
  );
}
