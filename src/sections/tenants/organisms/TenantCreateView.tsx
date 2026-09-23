"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTenantApi } from "@/modules/tenant/presentation/hooks/useTenantApi";
import TenantForm, {
  type TenantFormValue,
} from "@/sections/tenants/molecules/TenantForm";

export default function TenantCreateView() {
  const router = useRouter();
  const { createTenant, mutationState } = useTenantApi();
  const [error, setError] = useState<string | null>(null);

  async function submit(value: TenantFormValue) {
    const result = await createTenant({
      slug: value.slug,
      name: value.name,
      customDomain: value.customDomain || null,
    });
    if (result.error || !result.data) {
      setError(result.error ?? "Gagal membuat tenant.");
      return;
    }
    router.push(`/dashboard/tenants/${result.data.id}`);
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Tambah tenant</h1>
        <p className="text-sm text-slate-500">
          Buat metadata tenant terlebih dahulu. Credential dikonfigurasi setelah
          tenant tersedia.
        </p>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <TenantForm loading={mutationState.loading} onSubmitAction={submit} />
    </section>
  );
}
