import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h1">Portal Peserta Ujian</Typography>
        <Typography variant="subheading" className="mt-1">
          Daftar mata pelajaran dan ujian yang tersedia untuk Anda.
        </Typography>
      </div>

      <Card className="p-8 text-center">
        <p className="mb-2 text-base text-slate-700 dark:text-gray-300">
          Belum ada ujian aktif yang dijadwalkan saat ini.
        </p>
        <p className="text-xs text-slate-500 dark:text-gray-500">
          Silakan hubungi pengawas atau guru jika ujian seharusnya sudah
          dimulai.
        </p>
      </Card>
    </div>
  );
}
