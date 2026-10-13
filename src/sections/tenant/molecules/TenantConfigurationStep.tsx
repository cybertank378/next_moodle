"use client";

import type { TenantStatus } from "@/modules/tenant/domain/types/TenantMetadata";
import SelectField from "@/shared-ui/component/SelectField";

export interface TenantConfigurationData {
  status: TenantStatus;
}

interface TenantConfigurationStepProps {
  data: TenantConfigurationData;
  onChange: (field: keyof TenantConfigurationData, value: TenantStatus) => void;
}

export default function TenantConfigurationStep({
  data,
  onChange,
}: TenantConfigurationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Konfigurasi Operasional Tenant
        </h3>
        <p className="text-xs text-slate-500">
          Tentukan status ketersediaan awal tenant pada platform SaaS.
        </p>
      </div>

      <div className="space-y-4">
        <SelectField
          label="Status Awal Tenant *"
          value={data.status}
          onChange={(e) => onChange("status", e.target.value as TenantStatus)}
          helperText="Pilih status awal akses platform untuk tenant baru ini."
        >
          <option value="ACTIVE">
            ACTIVE — Siap digunakan langsung oleh pengguna
          </option>
          <option value="MAINTENANCE">
            MAINTENANCE — Mode pemeliharaan / persiapan data
          </option>
          <option value="SUSPENDED">
            SUSPENDED — Akses dibekukan sementara
          </option>
        </SelectField>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
          <h4 className="text-xs font-semibold text-slate-800">
            Keterangan Siklus Status:
          </h4>
          <div className="text-xs text-slate-600 space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="font-bold text-emerald-700 shrink-0">
                • ACTIVE:
              </span>
              <span>
                Pengguna (admin, guru, siswa) dapat masuk dan melakukan
                aktivitas ujian.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-700 shrink-0">
                • MAINTENANCE:
              </span>
              <span>
                Portal menampilkan informasi bahwa sistem sedang dalam masa
                konfigurasi/pemeliharaan.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-rose-700 shrink-0">
                • SUSPENDED:
              </span>
              <span>
                Seluruh akses login untuk institusi ini ditutup sementara.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
