"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "@/shared-ui/component/Skeleton";
import { useTenantsApi } from "@/modules/tenants/presentation/hooks/useTenantsApi";
import TenantForm, {
  type TenantFormValue,
} from "@/sections/tenants/molecules/TenantForm";

export default function TenantEditView() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { detailState, mutationState, getTenant, updateTenant } = useTenantsApi();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getTenant(params.id);
  }, [getTenant, params.id]);

  async function submit(value: TenantFormValue) {
    const result = await updateTenant(params.id, {
      name: value.name,
      customDomain: value.customDomain || null,
    });
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push(`/dashboard/tenants/${params.id}`);
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
    return <p className="p-6 text-rose-600">{detailState.error ?? "Tenant tidak ditemukan."}</p>;
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Edit tenant</h1>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <TenantForm
        tenant={detailState.data}
        loading={mutationState.loading}
        onSubmitAction={submit}
      />
    </section>
  );
}
