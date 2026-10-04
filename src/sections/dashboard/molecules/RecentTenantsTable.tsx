import Link from "next/link";
import type { RecentTenantResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import { formatDisplayDate } from "@/modules/dashboard/presentation/helpers/dashboardFormatters";
import TenantStatusBadge from "@/sections/tenant/atoms/TenantStatusBadge";
import Card from "@/shared-ui/component/Card";
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
const COLUMN_COUNT = 4;

interface RecentTenantsTableProps {
  tenants: RecentTenantResponseDto[];
  loading: boolean;
}

export default function RecentTenantsTable({
  tenants,
  loading,
}: RecentTenantsTableProps) {
  return (
    <Card className="border border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/60">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Tenant Terbaru
        </h2>
        <Link
          href="/admin/tenants"
          className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Lihat semua →
        </Link>
      </div>

      <Table>
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
          ) : tenants.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={COLUMN_COUNT}
                className="py-8 text-center text-slate-500 dark:text-slate-400"
              >
                Belum ada tenant terdaftar.
              </TableCell>
            </TableRow>
          ) : (
            tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium text-slate-900 dark:text-slate-100">
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
    </Card>
  );
}
