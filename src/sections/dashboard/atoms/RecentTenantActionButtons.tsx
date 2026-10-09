// Files: src/sections/dashboard/atoms/RecentTenantActionButtons.tsx

"use client";

import { Edit, ExternalLink, Eye } from "lucide-react";
import Button from "@/shared-ui/component/Button";

interface RecentTenantActionButtonsProps {
  slug: string;
  tenantId?: string;
  onDetail: () => void;
  onEdit: () => void;
  onVisit: () => void;
}

export default function RecentTenantActionButtons({
  onDetail,
  onEdit,
  onVisit,
}: RecentTenantActionButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        size="sm"
        variant="ghost"
        color="primary"
        leftIcon={Eye}
        onClick={onDetail}
        title="Lihat Detail Tenant"
        aria-label="Lihat Detail Tenant"
        className="h-7 px-2 text-xs font-medium"
      >
        Detail
      </Button>

      <Button
        size="sm"
        variant="ghost"
        color="secondary"
        leftIcon={Edit}
        onClick={onEdit}
        title="Edit Tenant"
        aria-label="Edit Tenant"
        className="h-7 px-2 text-xs font-medium text-slate-600 hover:text-slate-900"
      >
        Edit
      </Button>

      <Button
        size="sm"
        variant="ghost"
        color="info"
        leftIcon={ExternalLink}
        onClick={onVisit}
        title="Kunjungi / Filter Tenant"
        aria-label="Kunjungi / Filter Tenant"
        className="h-7 px-2 text-xs font-medium text-sky-600 hover:text-sky-800"
      >
        Buka
      </Button>
    </div>
  );
}
