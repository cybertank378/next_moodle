// Files: src/sections/dashboard/molecules/AdminTenantAttentionBanner.tsx

import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import type { TenantStatusSummary } from "@/modules/dashboard/domain/types/DashboardTypes";
import { ROUTES } from "@/libs/routes";

export function calculateAttentionCount(summary: TenantStatusSummary): number {
  return (summary?.maintenance ?? 0) + (summary?.suspended ?? 0);
}

interface AdminTenantAttentionBannerProps {
  summary: TenantStatusSummary;
}

export default function AdminTenantAttentionBanner({
  summary,
}: AdminTenantAttentionBannerProps) {
  const attentionCount = calculateAttentionCount(summary);

  if (attentionCount <= 0) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Pemberitahuan perhatian tenant"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-blue-200/80 bg-blue-50/80 px-4 py-3.5 text-sm text-blue-900 shadow-sm transition-all"
    >
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm font-bold text-xs"
        >
          <Info size={16} />
        </div>
        <div>
          <span className="font-bold text-slate-900">
            {attentionCount} tenant memerlukan perhatian
          </span>
          <span className="block sm:inline sm:ml-2 text-slate-600">
            Tinjau tenant dalam pemeliharaan atau ditangguhkan.
          </span>
        </div>
      </div>

      <Link
        href={ROUTES.ADMIN.TENANTS}
        className="inline-flex items-center gap-1 self-start sm:self-auto font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors shrink-0 text-sm"
      >
        <span>Tinjau tenant</span>
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );
}
