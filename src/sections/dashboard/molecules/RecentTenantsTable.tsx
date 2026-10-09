// Files: src/sections/dashboard/molecules/RecentTenantsTable.tsx

"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { ROUTES } from "@/libs/routes";
import type { RecentTenantResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import { formatDisplayDate } from "@/modules/dashboard/presentation/helpers/dashboardFormatters";
import RecentTenantActionButtons from "@/sections/dashboard/atoms/RecentTenantActionButtons";
import Avatar from "@/shared-ui/component/Avatar";
import Badge from "@/shared-ui/component/Badge";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import EmptyState from "@/shared-ui/component/EmptyState";
import Pagination from "@/shared-ui/component/Pagination";
import SearchField from "@/shared-ui/component/SearchField";
import SelectField from "@/shared-ui/component/SelectField";
import Skeleton from "@/shared-ui/component/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/shared-ui/component/Table";

const SKELETON_ROWS = 3;
const COLUMN_COUNT = 5;
const ITEMS_PER_PAGE = 5;

export function filterRecentTenants(
  tenants: RecentTenantResponseDto[],
  searchQuery: string,
  statusFilter?: string,
): RecentTenantResponseDto[] {
  const query = searchQuery.trim().toLowerCase();
  const status = statusFilter?.toUpperCase();

  return tenants.filter((tenant) => {
    const matchesSearch =
      !query ||
      tenant.name.toLowerCase().includes(query) ||
      tenant.slug.toLowerCase().includes(query);

    const matchesStatus =
      !status || status === "ALL" || tenant.status.toUpperCase() === status;

    return matchesSearch && matchesStatus;
  });
}

/** Palette for tenant circle avatars */
const AVATAR_BG_COLORS = [
  "bg-blue-600",
  "bg-purple-600",
  "bg-amber-600",
  "bg-emerald-600",
  "bg-rose-600",
];

function getAvatarBgColor(index: number): string {
  return AVATAR_BG_COLORS[index % AVATAR_BG_COLORS.length];
}

interface RecentTenantsTableProps {
  tenants: RecentTenantResponseDto[];
  loading: boolean;
}

export default function RecentTenantsTable({
  tenants,
  loading,
}: RecentTenantsTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleNavigateToAllTenants = () => {
    router.push(ROUTES.ADMIN.TENANTS);
  };

  const handleNavigateToTenantDetail = (tenant: RecentTenantResponseDto) => {
    router.push(ROUTES.ADMIN.TENANT_DETAIL(tenant.id));
  };

  const handleNavigateToTenantEdit = (tenant: RecentTenantResponseDto) => {
    router.push(ROUTES.ADMIN.TENANT_EDIT(tenant.id));
  };

  const handleNavigateToTenantSearch = (slug: string) => {
    router.push(`${ROUTES.ADMIN.TENANTS}?search=${encodeURIComponent(slug)}`);
  };

  const statusSelectId = useId();

  const filteredTenants = useMemo(() => {
    return filterRecentTenants(tenants, searchQuery, statusFilter);
  }, [tenants, searchQuery, statusFilter]);

  const totalItems = filteredTenants.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTenants = filteredTenants.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm p-0 overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Tenant Terbaru</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sekolah dan organisasi yang baru bergabung.
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          color="primary"
          rightIcon={ArrowRight}
          onClick={handleNavigateToAllTenants}
          className="text-sm font-semibold shrink-0"
        >
          Lihat semua
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-slate-50/60 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <SearchField
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Cari nama atau slug tenant"
            size="sm"
            className="bg-white"
          />
        </div>

        <div className="w-full sm:w-48">
          <SelectField
            id={statusSelectId}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            size="sm"
            variant="outlined"
            aria-label="Filter berdasarkan status tenant"
            className="text-xs sm:text-sm"
          >
            <option value="all">Semua status</option>
            <option value="ACTIVE">Aktif</option>
            <option value="MAINTENANCE">Pemeliharaan</option>
            <option value="SUSPENDED">Ditangguhkan</option>
          </SelectField>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <Table wrapperClassName="border-0 rounded-none w-full">
          <TableHead>
            <tr className="border-b border-slate-100 bg-slate-50/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <TableHeaderCell className="py-3 px-4">TENANT</TableHeaderCell>
              <TableHeaderCell className="py-3 px-4">SLUG</TableHeaderCell>
              <TableHeaderCell className="py-3 px-4">STATUS</TableHeaderCell>
              <TableHeaderCell className="py-3 px-4">
                TANGGAL DAFTAR
              </TableHeaderCell>
              <TableHeaderCell className="py-3 px-4 text-right">
                AKSI
              </TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: SKELETON_ROWS }, (_, i) => `sk-${i}`).map(
                (key) => (
                  <TableRow key={key}>
                    <TableCell colSpan={COLUMN_COUNT} className="py-4">
                      <Skeleton height={24} />
                    </TableCell>
                  </TableRow>
                ),
              )
            ) : paginatedTenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMN_COUNT} className="py-8 text-center">
                  <EmptyState
                    title="Tidak ada tenant ditemukan"
                    description={
                      searchQuery || statusFilter !== "all"
                        ? "Tidak ada tenant yang cocok dengan filter pencarian."
                        : "Belum ada tenant terdaftar."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedTenants.map((tenant, index) => {
                const avatarBg = getAvatarBgColor(index);
                const statusNormalized = tenant.status.toUpperCase();

                return (
                  <TableRow
                    key={tenant.id}
                    className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Tenant with Avatar */}
                    <TableCell className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={tenant.name}
                          size="sm"
                          className={`${avatarBg} text-white shadow-sm shrink-0`}
                        />
                        <span className="truncate max-w-[240px]">
                          {tenant.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Slug */}
                    <TableCell className="py-3.5 px-4 text-xs font-mono text-slate-500">
                      {tenant.slug}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3.5 px-4">
                      {statusNormalized === "ACTIVE" ? (
                        <Badge
                          color="success"
                          variant="soft"
                          className="gap-1.5"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Aktif
                        </Badge>
                      ) : statusNormalized === "MAINTENANCE" ? (
                        <Badge
                          color="warning"
                          variant="soft"
                          className="gap-1.5"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Pemeliharaan
                        </Badge>
                      ) : (
                        <Badge color="error" variant="soft" className="gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          Ditangguhkan
                        </Badge>
                      )}
                    </TableCell>

                    {/* Registration Date */}
                    <TableCell className="py-3.5 px-4 text-xs text-slate-600">
                      {formatDisplayDate(tenant.createdAt)}
                    </TableCell>

                    {/* Action Buttons (Atom) */}
                    <TableCell className="py-3.5 px-4 text-right">
                      <RecentTenantActionButtons
                        slug={tenant.slug}
                        tenantId={tenant.id}
                        onDetail={() => handleNavigateToTenantDetail(tenant)}
                        onEdit={() => handleNavigateToTenantEdit(tenant)}
                        onVisit={() =>
                          handleNavigateToTenantSearch(tenant.slug)
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-white">
        <p>
          Menampilkan {paginatedTenants.length} dari {totalItems} tenant
          terbaru.
        </p>

        {totalItems > ITEMS_PER_PAGE && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChangeAction={setCurrentPage}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
