import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import QuizListView from "@/sections/exams/organisms/QuizListView";

export default async function ExamsPage() {
  await requireDashboardRoles(["TENANT", "STUDENT"]);

  return <QuizListView />;
}
