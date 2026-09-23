import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function ExamAttemptPage() {
  await requireDashboardRoles(["STUDENT"]);

  return (
    <DashboardRoutePlaceholder
      title="Attempt Ujian"
      description="Route attempt ujian peserta."
    />
  );
}
