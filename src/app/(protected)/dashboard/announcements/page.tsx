import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function AnnouncementsPage() {
  await requireDashboardRoles(["STUDENT", "TEACHER", "TENANT"]);
  return (
    <DashboardRoutePlaceholder
      title="Pengumuman"
      description="Informasi dan pengumuman terbaru seputar kegiatan pembelajaran."
    />
  );
}
