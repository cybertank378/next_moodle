"use client";

import { Bell, CheckCircle, ChevronRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";

export function StudentRightRailWidgets() {
  const router = useRouter();

  const handleNavigateToSchedule = () => {
    router.push(ROUTES.STUDENT.SCHEDULE);
  };

  const handleNavigateToAnnouncements = () => {
    router.push(ROUTES.STUDENT.ANNOUNCEMENTS);
  };

  const handleNavigateToActivities = () => {
    router.push(ROUTES.STUDENT.ACTIVITIES);
  };

  return (
    <>
      <Card className="border-slate-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-extrabold flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" /> Jadwal Hari Ini
          </h3>
          <Button
            size="sm"
            variant="ghost"
            color="primary"
            rightIcon={ChevronRight}
            onClick={handleNavigateToSchedule}
            className="text-blue-600 text-[11px] font-bold hover:text-blue-700 h-auto p-0"
          >
            Lihat Semua
          </Button>
        </div>
        <div className="py-10 text-center text-slate-500 text-sm font-medium border-2 border-dashed border-slate-100 rounded-2xl mx-1 mt-2">
          Tidak ada jadwal pelajaran hari ini.
        </div>
      </Card>

      <Card className="border-slate-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-extrabold flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-700" /> Pengumuman Terbaru
          </h3>
          <Button
            size="sm"
            variant="ghost"
            color="primary"
            rightIcon={ChevronRight}
            onClick={handleNavigateToAnnouncements}
            className="text-blue-600 text-[11px] font-bold hover:text-blue-700 h-auto p-0"
          >
            Lihat Semua
          </Button>
        </div>
        <div className="py-10 text-center text-slate-500 text-sm font-medium border-2 border-dashed border-slate-100 rounded-2xl mx-1 mt-2">
          Belum ada pengumuman terbaru.
        </div>
      </Card>

      <Card className="border-slate-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-extrabold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-slate-700" /> Aktivitas Terbaru
          </h3>
          <Button
            size="sm"
            variant="ghost"
            color="primary"
            rightIcon={ChevronRight}
            onClick={handleNavigateToActivities}
            className="text-blue-600 text-[11px] font-bold hover:text-blue-700 h-auto p-0"
          >
            Lihat Semua
          </Button>
        </div>
        <div className="py-10 text-center text-slate-500 text-sm font-medium border-2 border-dashed border-slate-100 rounded-2xl mx-1 mt-2">
          Belum ada aktivitas terbaru.
        </div>
      </Card>
    </>
  );
}
