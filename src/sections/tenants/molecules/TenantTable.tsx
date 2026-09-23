"use client";

import Link from "next/link";
import type { TenantSummaryResponseDTO } from "@/modules/tenants/domain/dto/TenantDTOs";
import Skeleton from "@/shared-ui/component/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/shared-ui/component/Table";
import TenantEmptyState from "@/sections/tenants/atoms/TenantEmptyState";
import TenantStatusBadge from "@/sections/tenants/atoms/TenantStatusBadge";

export default function TenantTable({
  tenants,
  loading,
}: {
  tenants: TenantSummaryResponseDTO[];
  loading: boolean;
}) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Tenant</TableHeaderCell>
          <TableHeaderCell>Slug</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Credential</TableHeaderCell>
          <TableHeaderCell>Domain</TableHeaderCell>
          <TableHeaderCell>Aksi</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading &&
          Array.from({ length: 5 }, (_, index) => (
            <TableRow key={`tenant-skeleton-${index + 1}`}>
              <TableCell colSpan={6}>
                <Skeleton height={24} />
              </TableCell>
            </TableRow>
          ))}

        {!loading && tenants.length === 0 && (
          <TableRow>
            <TableCell colSpan={6}>
              <TenantEmptyState />
            </TableCell>
          </TableRow>
        )}

        {!loading &&
          tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell className="font-medium text-slate-900">
                {tenant.name}
              </TableCell>
              <TableCell>{tenant.slug}</TableCell>
              <TableCell>
                <TenantStatusBadge status={tenant.status} />
              </TableCell>
              <TableCell>
                {tenant.hasMoodleCredential ? "Terkonfigurasi" : "Belum"}
              </TableCell>
              <TableCell>{tenant.customDomain ?? "—"}</TableCell>
              <TableCell>
                <div className="flex gap-3">
                  <Link
                    className="text-indigo-600 hover:underline"
                    href={`/dashboard/tenants/${tenant.id}`}
                  >
                    Detail
                  </Link>
                  <Link
                    className="text-slate-600 hover:underline"
                    href={`/dashboard/tenants/${tenant.id}/edit`}
                  >
                    Edit
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
