"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ROUTES } from "@/libs/routes";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handled by auth use cases in Issue 06/07
    router.push(ROUTES.HOME);
  };

  return (
    <div className="p-8 rounded-xl bg-[#151521] border border-slate-800 shadow-xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Masuk ke Akun</h1>
        <p className="text-sm text-gray-400">
          Masukkan username dan password Moodle Anda
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#1e1e2d] border border-slate-700 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow"
        >
          Masuk
        </button>
      </form>
      <div className="mt-6 text-center text-xs text-gray-400 space-y-2">
        <div>
          <button
            type="button"
            onClick={() => router.push(ROUTES.AUTH.FORGOT_PASSWORD)}
            className="text-indigo-400 hover:underline"
          >
            Lupa kata sandi?
          </button>
        </div>
      </div>
    </div>
  );
}
