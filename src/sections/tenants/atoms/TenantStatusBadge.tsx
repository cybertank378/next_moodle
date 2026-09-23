import type { TenantStatus } from "@/modules/tenant/domain/types/TenantMetadata";

const styles: Record<TenantStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  MAINTENANCE: "bg-amber-100 text-amber-700",
  SUSPENDED: "bg-rose-100 text-rose-700",
};

export default function TenantStatusBadge({
  status,
}: {
  status: TenantStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}
