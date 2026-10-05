import ExamMonitorOverview from "@/sections/exam-monitor/organisms/ExamMonitorOverview";

export default function ExamMonitorPageView({ quizId }: { quizId: number }) {
  return (
    <div className="p-6 md:p-8">
      <ExamMonitorOverview quizId={quizId} />
    </div>
  );
}
