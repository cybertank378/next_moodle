"use client";

import { useEffect } from "react";
import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";
import StatCard from "@/sections/dashboard/molecules/StatCard";
import DashboardHeader from "@/sections/dashboard/molecules/DashboardHeader";
import ActiveMonitoringTable from "@/sections/dashboard/molecules/ActiveMonitoringTable";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";

export default function ProctorDashboardOverview() {
  const { proctorState, fetchProctorOverview } = useDashboardApi();

  useEffect(() => {
    fetchProctorOverview();
  }, [fetchProctorOverview]);

  const { data, loading, error } = proctorState;

  if (error) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        Gagal memuat: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <DashboardHeader
        title="Konsol Pengawas"
        subtitle="Pantau sesi ujian langsung dan tinjau aktivitas mencurigakan."
        titleClassName="bg-gradient-to-r from-indigo-700 to-rose-600 dark:from-indigo-400 dark:to-rose-400 bg-clip-text text-transparent"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          label="Ujian Langsung"
          value={data?.liveExams ?? 0}
          hint="Sesi sedang berjalan"
          accent="indigo"
          loading={loading}
          unavailable={!data}
        />
        <StatCard
          label="Kandidat Aktif"
          value={data?.activeCandidates ?? 0}
          hint="Terhubung dan dipantau"
          accent="emerald"
          loading={loading}
          unavailable={!data}
        />
        <StatCard
          label="Tanda Insiden"
          value={data?.incidentFlags ?? 0}
          hint="Perlu ditinjau"
          accent="rose"
          loading={loading}
          unavailable={!data}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-xl shadow-indigo-500/5 dark:shadow-none border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md overflow-hidden transition-colors">
          <ActiveMonitoringTable sessions={data?.sessions ?? []} loading={loading} />
        </Card>
      </div>
    </div>
  );
}
