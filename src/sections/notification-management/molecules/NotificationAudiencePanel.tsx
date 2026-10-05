// Files: src/sections/notification-management/molecules/NotificationAudiencePanel.tsx
"use client";

import { Users, CheckCircle2 } from "lucide-react";
import {
  type NotificationAudienceSpec,
  NotificationAudienceScope,
} from "@/modules/notification/domain/types/NotificationTypes";
import Button from "@/shared-ui/component/Button";

interface Props {
  role: "ADMIN" | "TENANT";
  audience: NotificationAudienceSpec;
  onChange: (spec: NotificationAudienceSpec) => void;
  onPreviewAudience: () => void;
  estimatedCount?: number;
  loadingCount?: boolean;
  disabled?: boolean;
}

export default function NotificationAudiencePanel({
  role,
  audience,
  onChange,
  onPreviewAudience,
  estimatedCount,
  loadingCount = false,
  disabled = false,
}: Props) {
  const roleOptions = [
    { value: "STUDENT", label: "Siswa / Peserta Ujian" },
    { value: "TEACHER", label: "Guru / Pengawas" },
    ...(role === "ADMIN" ? [{ value: "TENANT", label: "Pengelola Sekolah / Tenant" }] : []),
  ];

  const handleScopeChange = (scope: "ALL" | "ROLES") => {
    onChange({
      ...audience,
      scope:
        scope === "ALL"
          ? NotificationAudienceScope.ALL
          : NotificationAudienceScope.ROLES,
      roles: scope === "ALL" ? [] : audience.roles || ["STUDENT"],
    });
  };

  const toggleRole = (r: string) => {
    const current = audience.roles || [];
    if (current.includes(r)) {
      if (current.length > 1) {
        onChange({ ...audience, roles: current.filter((x) => x !== r) });
      }
    } else {
      onChange({ ...audience, roles: [...current, r] });
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 border border-slate-200 rounded-xl shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            Target Penerima (Audiens)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tentukan siapa yang akan menerima pengumuman ini.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPreviewAudience}
          disabled={disabled || loadingCount}
          className="text-xs"
        >
          {loadingCount ? "Menghitung..." : "Periksa Jumlah Penerima"}
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50/60 transition-colors">
          <input
            type="radio"
            name="audience-scope"
            className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
            checked={audience.scope === "ALL"}
            onChange={() => handleScopeChange("ALL")}
            disabled={disabled}
          />
          <div>
            <div className="text-xs font-semibold text-slate-900">
              {role === "ADMIN" ? "Seluruh Pengguna Platform" : "Seluruh Warga Sekolah"}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Kirim ke semua siswa, guru, dan staf aktif.
            </div>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50/60 transition-colors">
          <input
            type="radio"
            name="audience-scope"
            className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
            checked={audience.scope === "ROLES"}
            onChange={() => handleScopeChange("ROLES")}
            disabled={disabled}
          />
          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-900">Berdasarkan Role Tertentu</div>
            <div className="text-xs text-slate-500 mt-0.5 mb-2">
              Pilih satu atau beberapa role pengguna yang ditargetkan.
            </div>

            {audience.scope === "ROLES" && (
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                {roleOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-1.5 text-xs text-slate-700 font-medium cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={audience.roles?.includes(opt.value)}
                      onChange={() => toggleRole(opt.value)}
                      disabled={disabled}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </label>
      </div>

      {estimatedCount !== undefined && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Perkiraan penerima: <strong>{estimatedCount} pengguna</strong> akan menerima notifikasi ini.
          </span>
        </div>
      )}
    </div>
  );
}
