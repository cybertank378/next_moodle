import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import ExamMonitorPageView from "@/sections/exam-monitor/pages/ExamMonitorPageView";

interface ExamMonitorPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExamMonitorPage({
  params,
}: ExamMonitorPageProps) {
  await requireDashboardRoles(["TENANT", "TEACHER"]);
  const { id } = await params;
  return <ExamMonitorPageView quizId={Number(id) || 0} />;
}
