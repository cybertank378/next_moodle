"use client";

import { AlertCircle } from "lucide-react";
import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";

interface CourseFeaturePlaceholderProps {
  featureName: string;
  moduleName: string;
}

export default function CourseFeaturePlaceholder({
  featureName,
  moduleName,
}: CourseFeaturePlaceholderProps) {
  return (
    <Card className="p-8 sm:p-12 text-center border-dashed border-2 border-slate-200 bg-slate-50/60 rounded-3xl space-y-3">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60">
        <AlertCircle size={28} />
      </div>
      <Typography variant="h3" className="text-base font-bold text-slate-800">
        Fitur {featureName} Belum Tersedia
      </Typography>
      <Typography
        variant="body"
        className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed"
      >
        Layanan Moodle API (plugin local_examapi) untuk akses siswa terhadap
        modul {moduleName} saat ini belum terdaftar pada kontrak backend resmi.
        Antarmuka ini tidak menampilkan data rekaan demi integritas akademik.
      </Typography>
    </Card>
  );
}
