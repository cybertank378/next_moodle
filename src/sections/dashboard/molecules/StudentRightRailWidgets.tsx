import { Bell, CheckCircle, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import Card from "@/shared-ui/component/Card";

export function StudentRightRailWidgets() {
  return (
    <>
      <Card className="border-slate-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-extrabold flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" /> Jadwal Hari Ini
          </h3>
          <Link
            href="/dashboard/schedule"
            className="text-blue-600 text-[11px] font-bold flex items-center hover:text-blue-700"
          >
            Lihat Semua <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
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
          <Link
            href="/dashboard/announcements"
            className="text-blue-600 text-[11px] font-bold flex items-center hover:text-blue-700"
          >
            Lihat Semua <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
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
          <Link
            href="/dashboard/activities"
            className="text-blue-600 text-[11px] font-bold flex items-center hover:text-blue-700"
          >
            Lihat Semua <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
        <div className="py-10 text-center text-slate-500 text-sm font-medium border-2 border-dashed border-slate-100 rounded-2xl mx-1 mt-2">
          Belum ada aktivitas terbaru.
        </div>
      </Card>
    </>
  );
}
