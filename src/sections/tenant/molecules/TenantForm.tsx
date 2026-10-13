"use client";

import { type FormEvent, useState } from "react";
import type { TenantResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDto";
import Button from "@/shared-ui/component/Button";
import TextField from "@/shared-ui/component/TextField";

export interface TenantFormValue {
  slug: string;
  name: string;
  customDomain: string;
  adminUsername?: string;
  adminFirstname?: string;
  adminLastname?: string;
  adminEmail?: string;
  adminPassword?: string;
}

export default function TenantForm({
  tenant,
  loading,
  onSubmitAction,
}: {
  tenant?: TenantResponseDTO;
  loading: boolean;
  onSubmitAction: (value: TenantFormValue) => Promise<void>;
}) {
  const [slug, setSlug] = useState(tenant?.slug ?? "");
  const [name, setName] = useState(tenant?.name ?? "");
  const [customDomain, setCustomDomain] = useState(tenant?.customDomain ?? "");

  const [adminUsername, setAdminUsername] = useState("");
  const [adminFirstname, setAdminFirstname] = useState("");
  const [adminLastname, setAdminLastname] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmitAction({
      slug,
      name,
      customDomain,
      adminUsername: adminUsername.trim() || undefined,
      adminFirstname: adminFirstname.trim() || undefined,
      adminLastname: adminLastname.trim() || undefined,
      adminEmail: adminEmail.trim() || undefined,
      adminPassword: adminPassword || undefined,
    });
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <TextField
        label="Slug"
        value={slug}
        disabled={Boolean(tenant)}
        onChange={(event) => setSlug(event.target.value)}
        required
      />
      <TextField
        label="Nama tenant"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <TextField
        label="Custom domain"
        value={customDomain}
        onChange={(event) => setCustomDomain(event.target.value)}
        placeholder="exam.sekolah.sch.id"
      />

      {!tenant && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Akun Administrator Tenant
            </h3>
            <p className="text-xs text-slate-500">
              Akun awal untuk pengelola institusi login ke Tenant Dashboard.
            </p>
          </div>
          <TextField
            label="Username Admin"
            value={adminUsername}
            onChange={(event) => setAdminUsername(event.target.value)}
            placeholder="misal: admin_smkn1 atau operator1"
            helperText="Gunakan huruf kecil, angka, atau tanda hubung/underscore."
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Nama Depan"
              value={adminFirstname}
              onChange={(event) => setAdminFirstname(event.target.value)}
              placeholder="Admin"
            />
            <TextField
              label="Nama Belakang"
              value={adminLastname}
              onChange={(event) => setAdminLastname(event.target.value)}
              placeholder="Sekolah"
            />
          </div>
          <TextField
            label="Email Admin"
            type="email"
            value={adminEmail}
            onChange={(event) => setAdminEmail(event.target.value)}
            placeholder="admin@sekolah.sch.id"
          />
          <TextField
            label="Password Awal"
            type="password"
            enablePasswordToggle
            value={adminPassword}
            onChange={(event) => setAdminPassword(event.target.value)}
            placeholder="Minimal 8 karakter"
          />
        </div>
      )}

      <Button type="submit" loading={loading}>
        Simpan
      </Button>
    </form>
  );
}
