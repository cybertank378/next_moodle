import { getAuditRetentionOverview } from "@/modules/audit/infrastructure/repo/AuditRetentionOverview";
import { loadAuditInitialData } from "@/modules/audit/presentation/server/loadAuditInitialData";
import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import AuditPageView from "@/sections/audit/pages/AuditPageView";
export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const actor = await requireDashboardRoles(["ADMIN", "TENANT"]);
  if (!actor) return null;
  const { query, data } = await loadAuditInitialData(actor, await searchParams);
  const retention =
    actor.role === "ADMIN" ? await getAuditRetentionOverview() : undefined;
  return (
    <AuditPageView
      key={`${actor.userId}:${actor.role}:${actor.tenantId ?? "platform"}:${JSON.stringify(query)}`}
      initialData={data}
      initialQuery={query}
      retention={retention}
    />
  );
}
