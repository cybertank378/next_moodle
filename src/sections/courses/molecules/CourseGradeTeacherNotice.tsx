"use client";

import { Award } from "lucide-react";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";

interface CourseGradeTeacherNoticeProps {
  onOpenResults: () => void;
}

export default function CourseGradeTeacherNotice({
  onOpenResults,
}: CourseGradeTeacherNoticeProps) {
  return (
    <Card className="p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Award size={20} />
        </div>
        <div>
          <Typography
            variant="h3"
            className="text-base font-bold text-slate-900"
          >
            Rekap Nilai Siswa
          </Typography>
          <p className="text-xs text-slate-500">
            Sebagai guru pengampu, Anda dapat melihat rekapitulasi nilai dan
            hasil ujian seluruh siswa.
          </p>
        </div>
      </div>
      <div className="pt-2">
        <Button size="sm" color="primary" onClick={onOpenResults}>
          Buka Laporan Hasil Ujian
        </Button>
      </div>
    </Card>
  );
}
