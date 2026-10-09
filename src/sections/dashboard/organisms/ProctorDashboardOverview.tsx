"use client";

import { useEffect } from "react";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";
import ActiveMonitoringTable from "@/sections/dashboard/molecules/ActiveMonitoringTable";
import DashboardHeader from "@/sections/dashboard/molecules/DashboardHeader";
import StatCard from "@/sections/dashboard/molecules/StatCard";
import Card from "@/shared-ui/component/Card";
import { showErrorToast } from "@/shared-ui/component/Toast";
import Typography from "@/shared-ui/component/Typography";

export default function ProctorDashboardOverview() {
  const { proctorState, fetchProctorOverview } = useDashboardApi();

  useEffect(() => {
    fetchProctorOverview();
  }, [fetchProctorOverview]);

  const { data, loading, error } = proctorState;

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <DashboardHeader
        title="Konsol Pengawas"
        subtitle="Pantau sesi ujian langsung dan tinjau aktivitas mencurigakan."
        titleClassName="bg-gradient-to-r from-indigo-700 to-rose-600   bg-clip-text text-transparent"
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
        <Card className="shadow-xl shadow-indigo-500/5  border border-slate-200/60  bg-white/70  backdrop-blur-md overflow-hidden transition-colors">
          <ActiveMonitoringTable
            sessions={data?.sessions ?? []}
            loading={loading}
          />
        </Card>
      </div>
    </div>
  );
}
