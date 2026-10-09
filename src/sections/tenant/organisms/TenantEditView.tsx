"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/libs/routes";
import { useTenantApi } from "@/modules/tenant/presentation/hooks/useTenantApi";
import TenantForm, {
  type TenantFormValue,
} from "@/sections/tenant/molecules/TenantForm";
import Button from "@/shared-ui/component/Button";
import Skeleton from "@/shared-ui/component/Skeleton";

export default function TenantEditView() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { detailState, mutationState, getTenant, updateTenant } =
    useTenantApi();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getTenant(params.id);
  }, [getTenant, params.id]);

  const handleNavigateBack = () => {
    router.push(ROUTES.ADMIN.TENANTS);
  };

  async function submit(value: TenantFormValue) {
    const result = await updateTenant(params.id, {
      name: value.name,
      customDomain: value.customDomain || null,
    });
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push(ROUTES.ADMIN.TENANT_DETAIL(params.id));
  }

  if (detailState.loading) {
    return (
      <section className="mx-auto max-w-2xl space-y-4 p-6">
        <Skeleton height={36} />
        <Skeleton height={240} />
      </section>
    );
  }

  if (!detailState.data) {
    return (
      <p className="p-6 text-rose-600">
        {detailState.error ?? "Tenant tidak ditemukan."}
      </p>
    );
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
          <h1 className="text-2xl font-bold text-slate-900">Edit tenant</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbarui informasi nama dan domain tenant.
          </p>
        </div>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <TenantForm
        tenant={detailState.data}
        loading={mutationState.loading}
        onSubmitAction={submit}
      />
    </section>
  );
}
