import { Clock3, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
export function AuditRetentionBanner({ isAdmin }: { isAdmin: boolean }) {
  return (
    <section
      aria-label="Kebijakan retensi audit"
      className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-sky-50 p-5 md:flex-row md:items-center md:justify-between"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white p-3 text-indigo-600 shadow-sm">
          <ShieldCheck aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">
            Kebijakan Retensi Audit
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Log audit tidak dapat dimodifikasi atau dihapus sebelum berusia tiga
            bulan. Pembersihan manual hanya tersedia bagi administrator
            platform.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
              <LockKeyhole size={13} /> Retensi minimal 3 bulan
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
              <Clock3 size={13} /> Jadwal cleanup: 02.00 WIB
            </span>
          </div>
        </div>
      </div>
      {isAdmin && (
        <Link
          href="/dashboard/audit/retention"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Manajemen Retensi
        </Link>
      )}
    </section>
  );
}
