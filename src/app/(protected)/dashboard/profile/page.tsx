import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function ProfilePage() {
  await requireDashboardRoles(["STUDENT", "TEACHER", "TENANT"]);
  return (
    <DashboardRoutePlaceholder
      title="Profil Pengguna"
      description="Informasi akun pengguna dan pengaturan preferensi."
    />
  );
}
