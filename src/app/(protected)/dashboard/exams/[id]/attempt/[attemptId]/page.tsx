import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import ExamAttemptPageView from "@/sections/exam/pages/ExamAttemptPageView";

interface Props {
  params: Promise<{
    id: string;
    attemptId: string;
  }>;
}

export default async function ExamAttemptPage({ params }: Props) {
  await requireDashboardRoles(["STUDENT"]);
  const resolved = await params;
  const quizId = Number.parseInt(resolved.id, 10);
  const attemptId = Number.parseInt(resolved.attemptId, 10);

  return <ExamAttemptPageView quizId={quizId} attemptId={attemptId} />;
}
