"use client";

import { useEffect } from "react";
import { useExamMonitorApi } from "@/modules/exam-monitor/presentation/hooks/useExamMonitorApi";
import StatCard from "@/sections/dashboard/molecules/StatCard";
import Card from "@/shared-ui/component/Card";
import { showErrorToast } from "@/shared-ui/component/Toast";
import Typography from "@/shared-ui/component/Typography";
import ActiveParticipantsTable from "../molecules/ActiveParticipantsTable";

interface ExamMonitorOverviewProps {
  quizId: number;
}

export default function ExamMonitorOverview({
  quizId,
}: ExamMonitorOverviewProps) {
  const { monitorState, fetchMonitor } = useExamMonitorApi();

  useEffect(() => {
    fetchMonitor(quizId);

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchMonitor(quizId);
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchMonitor, quizId]);

  const { data, loading, error } = monitorState;

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div>
        <Typography
          variant="h2"
          className="bg-gradient-to-r from-indigo-700 to-rose-600   bg-clip-text text-transparent"
        >
          Pengawasan Ujian (Live)
        </Typography>
        <Typography variant="body" className="text-slate-500  mt-2">
          Memantau sesi ujian dan kandidat secara real-time.
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatCard
          label="Kandidat Aktif"
          value={data?.totalActive ?? 0}
          hint="Sedang mengerjakan"
          accent="emerald"
          loading={loading}
          unavailable={!data}
        />
        <StatCard
          label="Selesai"
          value={data?.totalFinished ?? 0}
          hint="Telah menyelesaikan ujian"
          accent="indigo"
          loading={loading}
          unavailable={!data}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-xl shadow-indigo-500/5  border border-slate-200/60  bg-white/70  backdrop-blur-md overflow-hidden transition-colors">
          <ActiveParticipantsTable
            quizId={quizId}
            participants={data?.participants ?? []}
            loading={loading}
          />
        </Card>
      </div>
    </div>
  );
}
