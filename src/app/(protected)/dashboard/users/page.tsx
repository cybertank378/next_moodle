import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function UsersPage() {
  await requireDashboardRoles(["TENANT"]);

  return (
    <DashboardRoutePlaceholder
      title="Pengguna"
      description="Route daftar pengguna."
    />
  );
}
