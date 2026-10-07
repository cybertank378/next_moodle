import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function CreateQuestionPage() {
  await requireDashboardRoles(["TENANT"]);
  return (
    <DashboardRoutePlaceholder
      title="Tambah Soal"
      description="Buat soal pada bank soal tenant."
    />
  );
}
