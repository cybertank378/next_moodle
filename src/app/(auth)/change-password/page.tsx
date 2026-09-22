import Link from "next/link";

export default function ChangePasswordPage() {
  return (
    <div className="p-8 rounded-xl bg-[#151521] border border-slate-800 shadow-xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Ganti Kata Sandi</h1>
        <p className="text-sm text-gray-400">
          Masukkan kata sandi saat ini dan kata sandi baru Anda
        </p>
      </div>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-xs font-semibold text-gray-300 mb-1"
          >
            Kata Sandi Saat Ini
          </label>
          <input
            id="currentPassword"
            type="password"
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#1e1e2d] border border-slate-700 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="newPassword"
            className="block text-xs font-semibold text-gray-300 mb-1"
          >
            Kata Sandi Baru
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#1e1e2d] border border-slate-700 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="button"
          className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow"
        >
          Simpan Kata Sandi
        </button>
      </form>
      <div className="mt-6 text-center text-xs text-gray-400">
        <Link href="/" className="text-indigo-400 hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
