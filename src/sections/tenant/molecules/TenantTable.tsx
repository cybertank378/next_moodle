"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import type { TenantSummaryResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDto";
import TenantEmptyState from "@/sections/tenant/atoms/TenantEmptyState";
import TenantStatusBadge from "@/sections/tenant/atoms/TenantStatusBadge";
import Button from "@/shared-ui/component/Button";
import Skeleton from "@/shared-ui/component/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/shared-ui/component/Table";

const SKELETON_ROWS = ["one", "two", "three", "four", "five"] as const;

export default function TenantTable({
  tenants,
  loading,
}: {
  tenants: TenantSummaryResponseDTO[];
  loading: boolean;
}) {
  const router = useRouter();

  const handleNavigateToTenantDetail = (tenantId: string) => {
    router.push(ROUTES.ADMIN.TENANT_DETAIL(tenantId));
  };

  const handleNavigateToTenantEdit = (tenantId: string) => {
    router.push(ROUTES.ADMIN.TENANT_EDIT(tenantId));
  };

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
          SKELETON_ROWS.map((row) => (
            <TableRow key={`tenant-skeleton-${row}`}>
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
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    color="primary"
                    onClick={() => handleNavigateToTenantDetail(tenant.id)}
                    className="text-xs h-7 px-2"
                  >
                    Detail
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="secondary"
                    onClick={() => handleNavigateToTenantEdit(tenant.id)}
                    className="text-xs h-7 px-2"
                  >
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
