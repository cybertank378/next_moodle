import ExamMonitorPageView from "@/sections/exam-monitor/pages/ExamMonitorPageView";

export default function ExamMonitorPage({
  params,
}: {
  params: { quizId: string };
}) {
  return <ExamMonitorPageView quizId={Number(params.quizId)} />;
}
