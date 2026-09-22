import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1e1e2d] text-gray-200 p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-xl bg-[#151521] border border-slate-800 shadow-2xl">
        <h1 className="text-6xl font-extrabold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h2>
        <p className="text-sm text-gray-400 mb-6">
          Anda tidak memiliki izin untuk mengakses halaman ini. Pastikan Anda
          masuk dengan akun yang memiliki hak akses yang sesuai.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
          >
            Login Ulang
          </Link>
        </div>
      </div>
    </div>
  );
}
