"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROUTES } from "@/libs/routes";
import { useTenantApi } from "@/modules/tenant/presentation/hooks/useTenantApi";
import TenantForm, {
  type TenantFormValue,
} from "@/sections/tenant/molecules/TenantForm";
import Button from "@/shared-ui/component/Button";

export default function TenantCreateView() {
  const router = useRouter();
  const { createTenant, mutationState } = useTenantApi();
  const [error, setError] = useState<string | null>(null);

  const handleNavigateBack = () => {
    router.push(ROUTES.ADMIN.TENANTS);
  };

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
    router.push(ROUTES.ADMIN.TENANT_DETAIL(result.data.id));
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          color="secondary"
          iconOnly
          leftIcon={ArrowLeft}
          onClick={handleNavigateBack}
          aria-label="Kembali ke daftar tenant"
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tambah tenant</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Buat metadata tenant terlebih dahulu. Credential dikonfigurasi
            setelah tenant tersedia.
          </p>
        </div>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <TenantForm loading={mutationState.loading} onSubmitAction={submit} />
    </section>
  );
}
