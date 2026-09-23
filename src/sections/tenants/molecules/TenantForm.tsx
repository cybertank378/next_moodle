"use client";

import { type FormEvent, useState } from "react";
import type { TenantResponseDTO } from "@/modules/tenants/domain/dto/TenantDTOs";
import Button from "@/shared-ui/component/Button";
import TextField from "@/shared-ui/component/TextField";

export interface TenantFormValue {
  slug: string;
  name: string;
  customDomain: string;
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmitAction({ slug, name, customDomain });
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
      <Button type="submit" loading={loading}>
        Simpan
      </Button>
    </form>
  );
}
