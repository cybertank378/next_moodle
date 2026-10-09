import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import ExamAttemptPageView from "@/sections/exam/pages/ExamAttemptPageView";

interface ExamAttemptPageProps {
  params: Promise<{ id: string; attemptId: string }>;
}

export default async function ExamAttemptPage({
  params,
}: ExamAttemptPageProps) {
  await requireDashboardRoles(["STUDENT"]);
  const { id, attemptId } = await params;
  return (
    <ExamAttemptPageView
      quizId={Number.parseInt(id, 10)}
      attemptId={Number.parseInt(attemptId, 10)}
    />
  );
}
