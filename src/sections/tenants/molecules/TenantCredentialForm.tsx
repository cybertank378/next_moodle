"use client";

import { useState, type FormEvent } from "react";
import type { ConfigureTenantCredentialRequestDTO } from "@/modules/tenants/domain/dto/TenantDTOs";
import Button from "@/shared-ui/component/Button";
import TextField from "@/shared-ui/component/TextField";

export default function TenantCredentialForm({
  loading,
  onSubmitAction,
}: {
  loading: boolean;
  onSubmitAction: (value: ConfigureTenantCredentialRequestDTO) => Promise<void>;
}) {
  const [moodleUrl, setMoodleUrl] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [proctorToken, setProctorToken] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmitAction({
      moodleUrl,
      adminToken,
      proctorToken: proctorToken || null,
      timeoutBudgetMs: 10000,
      sslVerify: true,
    });
    setAdminToken("");
    setProctorToken("");
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <TextField
        label="Moodle URL"
        value={moodleUrl}
        onChange={(event) => setMoodleUrl(event.target.value)}
        placeholder="https://moodle.sekolah.sch.id"
        required
      />
      <TextField
        label="Admin token"
        type="password"
        enablePasswordToggle
        autoComplete="new-password"
        value={adminToken}
        onChange={(event) => setAdminToken(event.target.value)}
        required
      />
      <TextField
        label="Proctor token (opsional)"
        type="password"
        enablePasswordToggle
        autoComplete="new-password"
        value={proctorToken}
        onChange={(event) => setProctorToken(event.target.value)}
      />
      <p className="text-xs text-slate-500">
        Token hanya dikirim ke API internal untuk dienkripsi dan tidak pernah dimuat kembali ke form.
      </p>
      <Button type="submit" loading={loading}>
        Simpan credential terenkripsi
      </Button>
    </form>
  );
}
