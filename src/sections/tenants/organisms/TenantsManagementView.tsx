"use client";

import { useEffect, useState } from "react";
import { useTenantsApi } from "@/modules/tenants/presentation/hooks/useTenantsApi";
import TenantTable from "@/sections/tenants/molecules/TenantTable";
import LinkButton from "@/shared-ui/component/LinkButton";
import Pagination from "@/shared-ui/component/Pagination";
import SelectField from "@/shared-ui/component/SelectField";
import TextField from "@/shared-ui/component/TextField";

export default function TenantsManagementView() {
  const { listState, listTenants } = useTenantsApi();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    void listTenants({ page, pageSize: 10, search, status });
  }, [listTenants, page, search, status]);

  const data = listState.data;

  return (
    <section className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tenant SaaS</h1>
          <p className="text-sm text-slate-500">
            Kelola metadata tenant dan konfigurasi credential terenkripsi.
          </p>
        </div>
        <LinkButton href="/dashboard/tenants/create">Tambah tenant</LinkButton>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <TextField
          label="Cari"
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          placeholder="Nama, slug, atau domain"
        />
        <SelectField
          label="Status"
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value);
          }}
        >
          <option value="">Semua status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
          <option value="SUSPENDED">SUSPENDED</option>
        </SelectField>
      </div>

      {listState.error && (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {listState.error}
        </p>
      )}

      <TenantTable tenants={data?.tenants ?? []} loading={listState.loading} />

      <Pagination
        currentPage={data?.page ?? page}
        totalItems={data?.total ?? 0}
        itemsPerPage={data?.pageSize ?? 10}
        onPageChangeAction={setPage}
      />
    </section>
  );
}
