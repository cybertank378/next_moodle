import { useState } from "react";
import Link from "next/link";
import type { RecentTenantResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import { formatDisplayDate } from "@/modules/dashboard/presentation/helpers/dashboardFormatters";
import TenantStatusBadge from "@/sections/tenant/atoms/TenantStatusBadge";
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

const SKELETON_ROWS = 3;
const COLUMN_COUNT = 4;
const ITEMS_PER_PAGE = 5;

interface RecentTenantsTableProps {
  tenants: RecentTenantResponseDto[];
  loading: boolean;
}

export default function RecentTenantsTable({
  tenants,
  loading,
}: RecentTenantsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = tenants.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTenants = tenants.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Card className="border border-slate-200/70 bg-white/70 backdrop-blur-xl   p-0 overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-slate-200/60 ">
        <h2 className="text-lg font-semibold text-slate-900 ">
          Tenant Terbaru
        </h2>
        <Link
          href="/admin/tenants"
          className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800  "
        >
          Lihat semua →
        </Link>
      </div>

      <Table wrapperClassName="border-0 rounded-none">
        <TableHead>
          <tr>
            <TableHeaderCell>Nama Tenant</TableHeaderCell>
            <TableHeaderCell>Slug</TableHeaderCell>
            <TableHeaderCell>Terdaftar</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: SKELETON_ROWS }, (_, i) => `sk-${i}`).map(
              (key) => (
                <TableRow key={key}>
                  <TableCell colSpan={COLUMN_COUNT}>
                    <Skeleton height={20} />
                  </TableCell>
                </TableRow>
              ),
            )
          ) : paginatedTenants.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={COLUMN_COUNT}
                className="py-8 text-center text-slate-500 "
              >
                Belum ada tenant terdaftar.
              </TableCell>
            </TableRow>
          ) : (
            paginatedTenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium text-slate-900 ">
                  {tenant.name}
                </TableCell>
                <TableCell className="font-mono text-xs">{tenant.slug}</TableCell>
                <TableCell>{formatDisplayDate(tenant.createdAt)}</TableCell>
                <TableCell>
                  <TenantStatusBadge status={tenant.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {!loading && totalItems > 0 && (
        <div className="px-4 py-3 border-t border-slate-200/60 ">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChangeAction={setCurrentPage}
          />
        </div>
      )}
    </Card>
  );
}
