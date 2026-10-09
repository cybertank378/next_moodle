"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/libs/routes";
import Card from "@/shared-ui/component/Card";
import Button from "@/shared-ui/component/Button";
import Typography from "@/shared-ui/component/Typography";
import { showErrorToast } from "@/shared-ui/component/Toast";
import StatCard from "@/sections/dashboard/molecules/StatCard";
import DashboardHeader from "@/sections/dashboard/molecules/DashboardHeader";
import UpcomingExamsTable from "@/sections/dashboard/molecules/UpcomingExamsTable";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";

export default function TenantDashboardOverview() {
  const router = useRouter();
  const { tenantState, fetchTenantOverview } = useDashboardApi();

  const handleNavigateToExams = () => {
    router.push(ROUTES.TENANT.EXAMS);
  };

  const handleNavigateToAudit = () => {
    router.push(ROUTES.TENANT.AUDIT);
  };

  useEffect(() => {
    fetchTenantOverview();
  }, [fetchTenantOverview]);

  const { data, loading, error } = tenantState;

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader
        title="Dasbor Tenant"
        subtitle="Selamat datang, Administrator. Kelola ujian, peserta, dan pantau aktivitas."
        titleClassName="bg-gradient-to-r from-blue-700 to-cyan-600   bg-clip-text text-transparent"
        borderBottom={false}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          label="Ujian Aktif"
          value={data?.activeExams ?? 0}
          hint="2 menunggu ulasan"
          accent="blue"
          loading={loading}
          unavailable={!data}
        />
        <StatCard
          label="Soal di Bank"
          value={data?.questionsInBank?.toLocaleString() ?? 0}
          hint="Dari 5 kategori"
          accent="cyan"
          loading={loading}
          unavailable={!data}
        />
        <StatCard
          label="Pengguna Terdaftar"
          value={data?.registeredUsers?.toLocaleString() ?? 0}
          hint="Pengguna Aktif: 24.1k"
          accent="indigo"
          loading={loading}
          unavailable={!data}
        />
        <StatCard
          label="Skor Rata-rata"
          value={`${data?.averageScore ?? 0}%`}
          hint="Tingkat Penyelesaian: 92%"
          accent="amber"
          loading={loading}
          unavailable={!data}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-xl shadow-blue-500/5  border border-slate-200/60  bg-white/70  backdrop-blur-md overflow-hidden h-full transition-colors">
            <UpcomingExamsTable exams={data?.upcomingExams ?? []} loading={loading} />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-xl shadow-amber-500/5  border border-amber-200/60  bg-gradient-to-br from-amber-50 to-orange-50   h-full transition-colors">
            <Typography
              variant="h2"
              className="text-amber-800  mb-4 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Tindakan Diperlukan
            </Typography>
            <div className="space-y-4">
              <div className="bg-white/80  p-4 rounded-lg border border-amber-200/60  shadow-sm">
                <Typography variant="h3" className="font-semibold text-sm text-slate-900 ">
                  Soal Belum Ada
                </Typography>
                <Typography variant="body" className="text-xs text-slate-600  mt-1 leading-relaxed">
                  "World History: Module 4" dijadwalkan untuk 2 Nov memiliki 0 soal.
                </Typography>
                <Button
                  onClick={handleNavigateToExams}
                  variant="ghost"
                  color="warning"
                  size="sm"
                  rightIcon={ArrowRight}
                  className="text-xs font-medium text-amber-700 hover:text-amber-900 mt-2 p-0 h-auto"
                >
                  Tinjau Ujian
                </Button>
              </div>
              <div className="bg-white/80 p-4 rounded-lg border border-amber-200/60 shadow-sm">
                <Typography variant="h3" className="font-semibold text-sm text-slate-900">
                  Insiden Mencurigakan
                </Typography>
                <Typography variant="body" className="text-xs text-slate-600 mt-1 leading-relaxed">
                  3 peserta ditandai keluar dari browser berulang kali dalam 24 jam terakhir.
                </Typography>
                <Button
                  onClick={handleNavigateToAudit}
                  variant="ghost"
                  color="warning"
                  size="sm"
                  rightIcon={ArrowRight}
                  className="text-xs font-medium text-amber-700 hover:text-amber-900 mt-2 p-0 h-auto"
                >
                  Lihat Log Audit
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
