// Files: src/sections/notification-management/molecules/NotificationAudiencePanel.tsx
"use client";

import { User, Users, X } from "lucide-react";
import {
  NotificationAudienceScope,
  type NotificationAudienceSpec,
} from "@/modules/notification/domain/types/NotificationTypes";
import SelectField from "@/shared-ui/component/SelectField";

interface Props {
  role: "ADMIN" | "TENANT";
  audience: NotificationAudienceSpec;
  onChange: (spec: NotificationAudienceSpec) => void;
  onPreviewAudience: () => void;
  tenantOptions?: { value: string; label: string }[];
  selectedTenant?: string;
  onTenantChange?: (tenantId: string) => void;
  estimatedCount?: number;
  isStaleCount?: boolean;
  loadingCount?: boolean;
  disabled?: boolean;
}

export default function NotificationAudiencePanel({
  role,
  audience,
  onChange,
  onPreviewAudience,
  tenantOptions,
  selectedTenant,
  onTenantChange,
  estimatedCount,
  isStaleCount = false,
  loadingCount = false,
  disabled = false,
}: Props) {
  const allRoles = [
    { value: "STUDENT", label: "Siswa" },
    { value: "TEACHER", label: "Guru" },
    ...(role === "ADMIN" ? [{ value: "TENANT", label: "Admin Sekolah" }] : []),
  ];

  const currentRoles = audience.roles || ["STUDENT", "TEACHER"];

  const handleScopeChange = (val: string) => {
    if (val === "ALL") {
      onChange({
        ...audience,
        scope: NotificationAudienceScope.ALL,
        roles: [],
      });
    } else if (val === "TENANT") {
      onChange({
        ...audience,
        scope: NotificationAudienceScope.TENANT,
        roles: currentRoles,
      });
    } else {
      onChange({
        ...audience,
        scope: NotificationAudienceScope.ROLES,
        roles: currentRoles.length > 0 ? currentRoles : ["STUDENT", "TEACHER"],
      });
    }
  };

  const removeRole = (roleValue: string) => {
    if (currentRoles.length > 1) {
      onChange({
        ...audience,
        roles: currentRoles.filter((r) => r !== roleValue),
      });
    }
  };

  const addRole = (roleValue: string) => {
    if (!currentRoles.includes(roleValue)) {
      onChange({
        ...audience,
        roles: [...currentRoles, roleValue],
      });
    }
  };

  const availableRolesToAdd = allRoles.filter(
    (r) => !currentRoles.includes(r.value),
  );

  return (
    <div className="space-y-4 bg-white p-5 sm:p-6 border border-slate-200/80 rounded-2xl shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0">
          <Users className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Audiens</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tentukan siapa yang akan menerima pengumuman ini.
          </p>
        </div>
      </div>

      {/* Field: Cakupan Penerima */}
      <div className="space-y-1.5">
        <label
          htmlFor="audience-scope"
          className="text-xs font-semibold text-slate-700 block"
        >
          Cakupan Penerima
        </label>
        <SelectField
          id="audience-scope"
          value={audience.scope}
          onChange={(e) => handleScopeChange(e.target.value)}
          disabled={disabled}
        >
          {role === "ADMIN" && <option value="TENANT">Tenant terpilih</option>}
          <option value="ALL">Semua pengguna</option>
          <option value="ROLES">Berdasarkan peran</option>
        </SelectField>
      </div>

      {/* Field: Tenant (for Admin) */}
      {role === "ADMIN" && audience.scope === "TENANT" && (
        <div className="space-y-1.5">
          <label
            htmlFor="tenant-select"
            className="text-xs font-semibold text-slate-700 block"
          >
            Tenant
          </label>
          <SelectField
            id="tenant-select"
            value={selectedTenant || "default-tenant"}
            onChange={(e) => onTenantChange?.(e.target.value)}
            disabled={disabled}
          >
            {tenantOptions && tenantOptions.length > 0 ? (
              tenantOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))
            ) : (
              <option value="default-tenant">SMP Hangtuah 2 Jakarta</option>
            )}
          </SelectField>
        </div>
      )}

      {/* Field: Peran Penerima with interactive removable chips */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-700 block">
          Peran Penerima
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {currentRoles.map((r) => {
            const label = allRoles.find((opt) => opt.value === r)?.label || r;
            return (
              <span
                key={r}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>{label}</span>
                <button
                  type="button"
                  onClick={() => removeRole(r)}
                  disabled={disabled || currentRoles.length <= 1}
                  className="hover:text-blue-900 rounded-full p-0.5 ml-0.5 disabled:opacity-40"
                  aria-label={`Hapus ${label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}

          {/* Add role button if some roles remain */}
          {availableRolesToAdd.length > 0 && !disabled && (
            <div className="relative inline-block">
              <select
                className="text-xs text-blue-600 bg-white border border-dashed border-blue-300 rounded-xl px-2.5 py-1.5 hover:bg-blue-50 focus:outline-none cursor-pointer"
                onChange={(e) => {
                  if (e.target.value) {
                    addRole(e.target.value);
                    e.target.value = "";
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  + Tambah Peran
                </option>
                {availableRolesToAdd.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Action Row: Hitung Penerima button & Status indicator */}
      <div className="pt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onPreviewAudience}
          disabled={disabled || loadingCount}
          className="px-4 py-2 rounded-xl text-xs font-semibold border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          {loadingCount ? "Menghitung..." : "Hitung Penerima"}
        </button>

        <div className="text-xs flex items-center gap-1.5">
          {loadingCount ? (
            <span className="text-slate-400">Sedang menghitung...</span>
          ) : isStaleCount ? (
            <span className="text-amber-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Audiens berubah, hitung ulang
            </span>
          ) : estimatedCount !== undefined ? (
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {estimatedCount.toLocaleString("id-ID")} penerima
            </span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              Belum dihitung
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
