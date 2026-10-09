"use client";

import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES } from "@/libs/routes";
import type { TenantStatus } from "@/modules/tenant/domain/types/TenantMetadata";
import { useTenantApi } from "@/modules/tenant/presentation/hooks/useTenantApi";
import TenantStatusBadge from "@/sections/tenant/atoms/TenantStatusBadge";
import TenantCredentialForm from "@/sections/tenant/molecules/TenantCredentialForm";
import Button from "@/shared-ui/component/Button";
import SelectField from "@/shared-ui/component/SelectField";
import Skeleton from "@/shared-ui/component/Skeleton";

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
  } = useTenantApi();
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
    return (
      <p className="p-6 text-rose-600">
        {detailState.error ?? "Tenant tidak ditemukan."}
      </p>
    );
  }

  const handleNavigateToEdit = () => {
    router.push(ROUTES.ADMIN.TENANT_EDIT(tenant.id));
  };

  const handleSaveStatus = async () => {
    const result = await updateTenantStatus(tenant.id, { status });
    setMessage(result.error ?? "Status tenant diperbarui.");
    if (!result.error) await getTenant(tenant.id);
  };

  const handleDeleteTenant = async () => {
    if (!window.confirm("Hapus tenant ini?")) return;
    const result = await deleteTenant(tenant.id);
    if (result.error) {
      setMessage(result.error);
      return;
    }
    router.push(ROUTES.ADMIN.TENANTS);
  };

  const handleNavigateBack = () => {
    router.push(ROUTES.ADMIN.TENANTS);
  };

  return (
    <section className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{tenant.name}</h1>
              <TenantStatusBadge status={tenant.status} />
            </div>
            <p className="text-sm text-slate-500">{tenant.slug}</p>
          </div>
        </div>
        <Button
          onClick={handleNavigateToEdit}
          variant="outline"
          color="secondary"
          size="sm"
          leftIcon={Edit}
        >
          Edit metadata
        </Button>
      </div>

      {message && (
        <p className="rounded-lg bg-slate-50 p-3 text-sm">{message}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <h2 className="mb-4 font-semibold">Metadata</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Custom domain</dt>
              <dd>{tenant.customDomain ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Moodle URL</dt>
              <dd>{tenant.credential?.moodleUrl ?? "Belum dikonfigurasi"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Admin token</dt>
              <dd>
                {tenant.credential?.hasAdminToken
                  ? "Tersimpan terenkripsi"
                  : "Belum"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Proctor token</dt>
              <dd>
                {tenant.credential?.hasProctorToken
                  ? "Tersimpan terenkripsi"
                  : "Belum"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h2 className="mb-4 font-semibold">Status tenant</h2>
          <div className="space-y-3">
            <SelectField
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as TenantStatus)
              }
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </SelectField>
            <Button
              variant="filled"
              color="primary"
              size="sm"
              loading={mutationState.loading}
              onClick={handleSaveStatus}
            >
              Simpan status
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <h2 className="mb-1 font-semibold">Credential Moodle</h2>
        <p className="mb-4 text-sm text-slate-500">
          Issue ini hanya menyimpan credential terenkripsi; tidak melakukan test
          koneksi Moodle.
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
          Menghapus metadata tenant beserta credential/branding terkait melalui
          cascade.
        </p>
        <Button
          color="danger"
          variant="outline"
          size="sm"
          leftIcon={Trash2}
          onClick={handleDeleteTenant}
        >
          Hapus tenant
        </Button>
      </div>
    </section>
  );
}
