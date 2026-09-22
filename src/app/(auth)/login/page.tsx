import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="p-8 rounded-xl bg-[#151521] border border-slate-800 shadow-xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Masuk ke Akun</h1>
        <p className="text-sm text-gray-400">
          Masukkan username dan password Moodle Anda
        </p>
      </div>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-xs font-semibold text-gray-300 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#1e1e2d] border border-slate-700 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#1e1e2d] border border-slate-700 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="button"
          className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow"
        >
          Masuk
        </button>
      </form>
      <div className="mt-6 text-center text-xs text-gray-400 space-y-2">
        <div>
          <Link
            href="/forgot-password"
            className="text-indigo-400 hover:underline"
          >
            Lupa kata sandi?
          </Link>
        </div>
      </div>
    </div>
  );
}
