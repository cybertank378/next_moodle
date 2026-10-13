"use client";

import TextField from "@/shared-ui/component/TextField";

export interface MoodleCredentialData {
  moodleUrl: string;
  adminToken: string;
  proctorToken: string;
}

interface TenantMoodleCredentialStepProps {
  data: MoodleCredentialData;
  onChange: (field: keyof MoodleCredentialData, value: string) => void;
  errors?: Partial<Record<keyof MoodleCredentialData, string>>;
}

export default function TenantMoodleCredentialStep({
  data,
  onChange,
  errors = {},
}: TenantMoodleCredentialStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Koneksi & Kredensial Moodle
        </h3>
        <p className="text-xs text-slate-500">
          Hubungkan tenant dengan server Moodle backend institusi. Token akan
          disimpan terenkripsi di database SaaS.
        </p>
      </div>

      <TextField
        label="Moodle Base URL *"
        value={data.moodleUrl}
        onChange={(e) => onChange("moodleUrl", e.target.value.trim())}
        placeholder="https://moodle.sekolah.sch.id"
        helperText="Harus menggunakan protokol HTTP atau HTTPS yang valid."
        error={errors.moodleUrl}
        required
      />

      <TextField
        label="Admin Web Service Token *"
        type="password"
        enablePasswordToggle
        autoComplete="new-password"
        value={data.adminToken}
        onChange={(e) => onChange("adminToken", e.target.value.trim())}
        placeholder="Token webservice (nextjs_admin)"
        helperText="Wajib diisi token Moodle dengan akses service nextjs_admin."
        error={errors.adminToken}
        required
      />

      <TextField
        label="Proctor Web Service Token (Opsional)"
        type="password"
        enablePasswordToggle
        autoComplete="new-password"
        value={data.proctorToken}
        onChange={(e) => onChange("proctorToken", e.target.value.trim())}
        placeholder="Token webservice (nextjs_proctor)"
        helperText="Digunakan untuk monitoring real-time dan intervensi ujian."
        error={errors.proctorToken}
      />

      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-900 space-y-1.5">
        <p className="font-semibold">Perlindungan Kredensial Rahasia:</p>
        <p>
          Token Moodle dienkripsi menggunakan AES-256-GCM + HKDF di level
          database SaaS. Nilai plaintext token tidak pernah disimpan di browser
          ataupun diexpose kembali pada API respons.
        </p>
      </div>
    </div>
  );
}
