import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function AuditPage() {
  await requireDashboardRoles(["ADMIN", "TENANT"]);

  return (
    <DashboardRoutePlaceholder
      title="Log Audit"
      description="Route log audit platform/tenant."
    />
  );
}
