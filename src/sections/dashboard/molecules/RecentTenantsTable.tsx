// Files: src/sections/dashboard/molecules/RecentTenantsTable.tsx

"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import type { RecentTenantResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import { formatDisplayDate } from "@/modules/dashboard/presentation/helpers/dashboardFormatters";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import Skeleton from "@/shared-ui/component/Skeleton";
import Pagination from "@/shared-ui/component/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/shared-ui/component/Table";
import { ROUTES } from "@/libs/routes";

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
      !status ||
      status === "ALL" ||
      tenant.status.toUpperCase() === status;

    return matchesSearch && matchesStatus;
  });
}

/** Generates deterministic 2-letter initials from name */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/** Palette for tenant circle avatars */
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-rose-100 text-rose-700 border-rose-200",
];

function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
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

  const handleNavigateToTenantSearch = (slug: string) => {
    router.push(`${ROUTES.ADMIN.TENANTS}?search=${encodeURIComponent(slug)}`);
  };

  const searchInputId = useId();
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
        <div className="relative flex-1">
          <label htmlFor={searchInputId} className="sr-only">
            Cari nama atau slug tenant
          </label>
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id={searchInputId}
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama atau slug tenant"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        <div className="w-full sm:w-48">
          <label htmlFor={statusSelectId} className="sr-only">
            Filter berdasarkan status tenant
          </label>
          <select
            id={statusSelectId}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs sm:text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          >
            <option value="all">Semua status</option>
            <option value="ACTIVE">Aktif</option>
            <option value="MAINTENANCE">Pemeliharaan</option>
            <option value="SUSPENDED">Ditangguhkan</option>
          </select>
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
              <TableHeaderCell className="py-3 px-4">TANGGAL DAFTAR</TableHeaderCell>
              <TableHeaderCell className="py-3 px-4 text-right">AKSI</TableHeaderCell>
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
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="py-10 text-center text-slate-500 text-sm"
                >
                  {searchQuery || statusFilter !== "all"
                    ? "Tidak ada tenant yang cocok dengan filter pencarian."
                    : "Belum ada tenant terdaftar."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedTenants.map((tenant, index) => {
                const initials = getInitials(tenant.name);
                const avatarColor = getAvatarColor(index);
                const statusNormalized = tenant.status.toUpperCase();

                return (
                  <TableRow
                    key={tenant.id}
                    className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Tenant with Initial Avatar */}
                    <TableCell className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${avatarColor}`}
                        >
                          {initials}
                        </div>
                        <span className="truncate max-w-[240px]">
                          {tenant.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Slug */}
                    <TableCell className="py-3.5 px-4 text-xs font-mono text-slate-500">
                      {tenant.slug}
                    </TableCell>

                    {/* Status Badge with Dot */}
                    <TableCell className="py-3.5 px-4">
                      {statusNormalized === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Aktif
                        </span>
                      ) : statusNormalized === "MAINTENANCE" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Pemeliharaan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 border border-rose-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          Ditangguhkan
                        </span>
                      )}
                    </TableCell>

                    {/* Registration Date */}
                    <TableCell className="py-3.5 px-4 text-xs text-slate-600">
                      {formatDisplayDate(tenant.createdAt)}
                    </TableCell>

                    {/* Action Link */}
                    <TableCell className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        color="secondary"
                        rightIcon={ArrowUpRight}
                        onClick={() => handleNavigateToTenantSearch(tenant.slug)}
                        className="h-7 px-2.5 text-xs font-semibold"
                      >
                        Detail
                      </Button>
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
          Menampilkan {paginatedTenants.length} dari {totalItems} tenant terbaru.
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
