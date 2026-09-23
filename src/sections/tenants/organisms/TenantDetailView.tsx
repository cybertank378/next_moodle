"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/shared-ui/component/Button";
import LinkButton from "@/shared-ui/component/LinkButton";
import SelectField from "@/shared-ui/component/SelectField";
import Skeleton from "@/shared-ui/component/Skeleton";
import { useTenantsApi } from "@/modules/tenants/presentation/hooks/useTenantsApi";
import TenantCredentialForm from "@/sections/tenants/molecules/TenantCredentialForm";
import TenantStatusBadge from "@/sections/tenants/atoms/TenantStatusBadge";
import type { TenantStatus } from "@/modules/tenants/domain/types/TenantTypes";

export default function TenantDetailView() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    detailState,
    mutationState,
    getTenant,
    configureCredential,
    updateTenantStatus,
    deleteTenant,
  } = useTenantsApi();
  const [status, setStatus] = useState<TenantStatus>("ACTIVE");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void getTenant(params.id);
  }, [getTenant, params.id]);

  useEffect(() => {
    if (detailState.data) setStatus(detailState.data.status);
  }, [detailState.data]);

  if (detailState.loading) {
    return (
      <section className="space-y-4 p-6">
        <Skeleton height={42} />
        <Skeleton height={260} />
      </section>
    );
  }

  const tenant = detailState.data;
  if (!tenant) {
    return <p className="p-6 text-rose-600">{detailState.error ?? "Tenant tidak ditemukan."}</p>;
  }

  return (
    <section className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{tenant.name}</h1>
            <TenantStatusBadge status={tenant.status} />
          </div>
          <p className="text-sm text-slate-500">{tenant.slug}</p>
        </div>
        <LinkButton href={`/dashboard/tenants/${tenant.id}/edit`} variant="outline">
          Edit metadata
        </LinkButton>
      </div>

      {message && <p className="rounded-lg bg-slate-50 p-3 text-sm">{message}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <h2 className="mb-4 font-semibold">Metadata</h2>
          <dl className="space-y-3 text-sm">
            <div><dt className="text-slate-500">Custom domain</dt><dd>{tenant.customDomain ?? "—"}</dd></div>
            <div><dt className="text-slate-500">Moodle URL</dt><dd>{tenant.credential?.moodleUrl ?? "Belum dikonfigurasi"}</dd></div>
            <div><dt className="text-slate-500">Admin token</dt><dd>{tenant.credential?.hasAdminToken ? "Tersimpan terenkripsi" : "Belum"}</dd></div>
            <div><dt className="text-slate-500">Proctor token</dt><dd>{tenant.credential?.hasProctorToken ? "Tersimpan terenkripsi" : "Belum"}</dd></div>
          </dl>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h2 className="mb-4 font-semibold">Status tenant</h2>
          <div className="space-y-3">
            <SelectField
              value={status}
              onChange={(event) => setStatus(event.target.value as TenantStatus)}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </SelectField>
            <Button
              loading={mutationState.loading}
              onClick={async () => {
                const result = await updateTenantStatus(tenant.id, { status });
                setMessage(result.error ?? "Status tenant diperbarui.");
                if (!result.error) await getTenant(tenant.id);
              }}
            >
              Simpan status
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <h2 className="mb-1 font-semibold">Credential Moodle</h2>
        <p className="mb-4 text-sm text-slate-500">
          Issue ini hanya menyimpan credential terenkripsi; tidak melakukan test koneksi Moodle.
        </p>
        <TenantCredentialForm
          loading={mutationState.loading}
          onSubmitAction={async (value) => {
            const result = await configureCredential(tenant.id, value);
            setMessage(result.error ?? "Credential tersimpan terenkripsi.");
            if (!result.error) await getTenant(tenant.id);
          }}
        />
      </div>

      <div className="rounded-xl border border-rose-200 p-5">
        <h2 className="font-semibold text-rose-700">Hapus tenant</h2>
        <p className="mb-3 text-sm text-slate-500">
          Menghapus metadata tenant beserta credential/branding terkait melalui cascade.
        </p>
        <Button
          color="error"
          variant="outline"
          onClick={async () => {
            if (!window.confirm("Hapus tenant ini?")) return;
            const result = await deleteTenant(tenant.id);
            if (result.error) {
              setMessage(result.error);
              return;
            }
            router.push("/dashboard/tenants");
          }}
        >
          Hapus tenant
        </Button>
      </div>
    </section>
  );
}
