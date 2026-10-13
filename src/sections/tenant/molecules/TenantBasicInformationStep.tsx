"use client";

import TextField from "@/shared-ui/component/TextField";

export interface BasicInformationData {
  name: string;
  slug: string;
  customDomain: string;
  adminUsername: string;
  adminFirstname: string;
  adminLastname: string;
  adminEmail: string;
  adminPassword: string;
}

interface TenantBasicInformationStepProps {
  data: BasicInformationData;
  onChange: (field: keyof BasicInformationData, value: string) => void;
  errors?: Partial<Record<keyof BasicInformationData, string>>;
}

export default function TenantBasicInformationStep({
  data,
  onChange,
  errors = {},
}: TenantBasicInformationStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Profil Institusi & Subdomain
          </h3>
          <p className="text-xs text-slate-500">
            Nama institusi/sekolah dan subdomain unik yang digunakan siswa dan
            pengajar.
          </p>
        </div>

        <TextField
          label="Nama Institusi / Sekolah *"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="contoh: SMA Negeri 1 Maju Bersama"
          error={errors.name}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Slug (Subdomain URL) *"
            value={data.slug}
            onChange={(e) =>
              onChange("slug", e.target.value.toLowerCase().trim())
            }
            placeholder="contoh: sman1-maju"
            helperText="3-63 karakter, huruf kecil, angka, atau tanda hubung (-)."
            error={errors.slug}
            required
          />

          <TextField
            label="Custom Domain (Opsional)"
            value={data.customDomain}
            onChange={(e) => onChange("customDomain", e.target.value.trim())}
            placeholder="contoh: ujian.sekolah.sch.id"
            helperText="Gunakan jika institusi memiliki domain mandiri."
            error={errors.customDomain}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Akun Administrator Tenant Awal
          </h3>
          <p className="text-xs text-slate-500">
            Akun awal berhak akses penuh ke portal pengelola institusi (Tenant
            Dashboard).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Username Admin *"
            value={data.adminUsername}
            onChange={(e) =>
              onChange("adminUsername", e.target.value.toLowerCase().trim())
            }
            placeholder="contoh: admin_sman1"
            helperText="3-50 karakter, huruf kecil, angka, underscore, atau hyphen."
            error={errors.adminUsername}
            required
          />

          <TextField
            label="Email Admin *"
            type="email"
            value={data.adminEmail}
            onChange={(e) => onChange("adminEmail", e.target.value.trim())}
            placeholder="admin@sekolah.sch.id"
            error={errors.adminEmail}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Nama Depan *"
            value={data.adminFirstname}
            onChange={(e) => onChange("adminFirstname", e.target.value)}
            placeholder="Administrator"
            error={errors.adminFirstname}
            required
          />

          <TextField
            label="Nama Belakang *"
            value={data.adminLastname}
            onChange={(e) => onChange("adminLastname", e.target.value)}
            placeholder="Sekolah"
            error={errors.adminLastname}
            required
          />
        </div>

        <TextField
          label="Password Awal (Opsional, min 8 karakter)"
          type="password"
          enablePasswordToggle
          value={data.adminPassword}
          onChange={(e) => onChange("adminPassword", e.target.value)}
          placeholder="Masukkan password atau biarkan kosong untuk diatur nanti"
          helperText="Minimal 8 karakter jika diisi."
          error={errors.adminPassword}
        />
      </div>
    </div>
  );
}
