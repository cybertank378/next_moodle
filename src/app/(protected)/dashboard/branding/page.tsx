import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function BrandingPage() {
  await requireDashboardRoles(["TENANT"]);
  return (
    <DashboardRoutePlaceholder
      title="Branding"
      description="Kelola identitas visual tenant."
    />
  );
}
