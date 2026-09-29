import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";

export default function TenantDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h1">Dashboard Instansi</Typography>
        <Typography variant="subheading" className="mt-1">
          Kelola ujian, peserta, bank soal, dan pemantauan sesi ujian Moodle.
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <Typography variant="subheading" className="mb-1">
            Ujian Aktif
          </Typography>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            0
          </p>
        </Card>

        <Card>
          <Typography variant="subheading" className="mb-1">
            Peserta Terdaftar
          </Typography>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            0
          </p>
        </Card>

        <Card>
          <Typography variant="subheading" className="mb-1">
            Status Moodle
          </Typography>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-green-400">
            Belum diverifikasi
          </p>
        </Card>
      </div>
    </div>
  );
}
