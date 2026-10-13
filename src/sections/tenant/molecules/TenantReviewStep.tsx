"use client";

import TenantStatusBadge from "@/sections/tenant/atoms/TenantStatusBadge";
import type { BasicInformationData } from "@/sections/tenant/molecules/TenantBasicInformationStep";
import type { TenantConfigurationData } from "@/sections/tenant/molecules/TenantConfigurationStep";
import type { MoodleCredentialData } from "@/sections/tenant/molecules/TenantMoodleCredentialStep";
import Button from "@/shared-ui/component/Button";

interface TenantReviewStepProps {
  basicInfo: BasicInformationData;
  credentials: MoodleCredentialData;
  configuration: TenantConfigurationData;
  onEditStep: (stepId: number) => void;
}

export default function TenantReviewStep({
  basicInfo,
  credentials,
  configuration,
  onEditStep,
}: TenantReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Review & Konfirmasi Pembuatan Tenant
        </h3>
        <p className="text-xs text-slate-500">
          Periksa kembali seluruh data sebelum memproses pembuatan tenant dan
          kredensial.
        </p>
      </div>

      <div className="space-y-4">
        {/* Step 1 Review */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              1. Informasi Institusi & Akun Admin
            </h4>
            <Button
              size="sm"
              variant="outline"
              color="secondary"
              onClick={() => onEditStep(1)}
              type="button"
            >
              Ubah
            </Button>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs">
            <div>
              <dt className="text-slate-500 font-medium">Nama Institusi</dt>
              <dd className="font-semibold text-slate-900 mt-0.5">
                {basicInfo.name || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Slug / Subdomain</dt>
              <dd className="font-mono text-slate-900 mt-0.5">
                {basicInfo.slug || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Custom Domain</dt>
              <dd className="text-slate-900 mt-0.5">
                {basicInfo.customDomain || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Username Admin</dt>
              <dd className="font-mono text-slate-900 mt-0.5">
                {basicInfo.adminUsername || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Nama Lengkap Admin</dt>
              <dd className="text-slate-900 mt-0.5">
                {`${basicInfo.adminFirstname} ${basicInfo.adminLastname}`.trim() ||
                  "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Email Admin</dt>
              <dd className="text-slate-900 mt-0.5">
                {basicInfo.adminEmail || "—"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Step 2 Review */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              2. Kredensial & Integrasi Moodle
            </h4>
            <Button
              size="sm"
              variant="outline"
              color="secondary"
              onClick={() => onEditStep(2)}
              type="button"
            >
              Ubah
            </Button>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs">
            <div className="md:col-span-2">
              <dt className="text-slate-500 font-medium">Moodle Base URL</dt>
              <dd className="font-mono text-slate-900 mt-0.5">
                {credentials.moodleUrl ||
                  "(Belum dikonfigurasi - dapat diatur nanti)"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Admin Token</dt>
              <dd className="font-mono text-slate-900 mt-0.5">
                {credentials.adminToken ? "••••••••••••••••••••" : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Proctor Token</dt>
              <dd className="font-mono text-slate-900 mt-0.5">
                {credentials.proctorToken ? "••••••••••••••••••••" : "—"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Step 3 Review */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              3. Status & Konfigurasi
            </h4>
            <Button
              size="sm"
              variant="outline"
              color="secondary"
              onClick={() => onEditStep(3)}
              type="button"
            >
              Ubah
            </Button>
          </div>
          <div className="pt-3 flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Status Awal:
            </span>
            <TenantStatusBadge status={configuration.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
