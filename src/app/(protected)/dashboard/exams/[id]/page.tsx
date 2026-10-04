import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import QuizDetailView from "@/sections/exam/organisms/QuizDetailView";

interface ExamDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExamDetailPage({ params }: ExamDetailPageProps) {
  await requireDashboardRoles(["TENANT", "STUDENT"]);
  const { id } = await params;
  const quizId = Number(id) || 0;

  return <QuizDetailView quizId={quizId} />;
}
