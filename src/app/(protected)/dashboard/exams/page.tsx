import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import QuizListView from "@/sections/exam/organisms/QuizListView";

export default async function ExamsPage() {
  await requireDashboardRoles(["TENANT", "TEACHER", "STUDENT"]);
  return <QuizListView />;
}
