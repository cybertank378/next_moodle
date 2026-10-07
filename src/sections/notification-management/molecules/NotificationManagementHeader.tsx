// Files: src/sections/notification-management/molecules/NotificationManagementHeader.tsx
"use client";

import { Plus, RefreshCw } from "lucide-react";
import { APP_NAME } from "@/libs/branding";
import Button from "@/shared-ui/component/Button";

interface Props {
  userRole?: "ADMIN" | "TENANT";
  role?: "ADMIN" | "TENANT";
  onNewCampaign: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export default function NotificationManagementHeader({
  userRole,
  role,
  onNewCampaign,
  onRefresh,
  loading = false,
}: Props) {
  const currentRole = userRole || role || "ADMIN";

  return (
    <div className="space-y-4">
      {/* Breadcrumb matching Mockup 1 with Aksaventra branding */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <span>
          {APP_NAME} /{" "}
          {currentRole === "ADMIN" ? "Admin Platform" : "Admin Sekolah"} /{" "}
          Pengelolaan Notifikasi
        </span>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Pengelolaan Notifikasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola pengumuman, penerima, dan jadwal pengiriman.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Segarkan data pengumuman"
            title="Segarkan data pengumuman"
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : "text-slate-600"}`}
            />
          </button>

          <Button
            variant="primary"
            size="md"
            onClick={onNewCampaign}
            className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Buat Pengumuman
          </Button>
        </div>
      </div>
    </div>
  );
}
