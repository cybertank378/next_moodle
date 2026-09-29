import { useCallback, useEffect, useState } from "react";
import { useTenantApi } from "@/modules/tenant/presentation/hooks/useTenantApi";
import TenantFilterBar, {
  type TenantFilterValue,
} from "@/sections/tenants/molecules/TenantFilterBar";
import TenantTable from "@/sections/tenants/molecules/TenantTable";
import LinkButton from "@/shared-ui/component/LinkButton";
import Pagination from "@/shared-ui/component/Pagination";
import Typography from "@/shared-ui/component/Typography";

export default function TenantsManagementView() {
  const { listState, listTenants } = useTenantApi();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    void listTenants({ page, pageSize: 10, search, status });
  }, [listTenants, page, search, status]);

  const handleFilterChange = useCallback((filter: TenantFilterValue) => {
    setPage(1);
    setSearch(filter.search);
    setStatus(filter.status);
  }, []);

  const data = listState.data;

  return (
    <section className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Typography variant="h1">Tenant SaaS</Typography>
          <Typography variant="subheading" className="mt-1">
            Kelola metadata tenant dan konfigurasi credential terenkripsi.
          </Typography>
        </div>
        <LinkButton href="/dashboard/tenants/create">Tambah tenant</LinkButton>
      </div>

      <TenantFilterBar
        initialValues={{ search, status }}
        onFilterChangeAction={handleFilterChange}
      />

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
