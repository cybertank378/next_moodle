"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ROUTES } from "@/libs/routes";
import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";

export function LoginForm() {
  const router = useRouter();
  const auth = useAuthApi();
  const [tenant, setTenant] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await auth.login({ tenant, username, password });
    router.push(ROUTES.DASHBOARD.ROOT);
    router.refresh();
  };

  return (
    <div className="p-8 rounded-xl bg-[#151521] border border-slate-800 shadow-xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Masuk ke Akun</h1>
        <p className="text-sm text-gray-400">
          Masukkan tenant, username, dan password Moodle Anda
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="tenant"
            className="block text-xs font-semibold text-gray-300 mb-1"
          >
            Tenant
          </label>
          <input
            id="tenant"
            type="text"
            value={tenant}
            onChange={(event) => setTenant(event.target.value)}
            placeholder="contoh: acme"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#1e1e2d] border border-slate-700 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
            required
          />
        </div>
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
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#1e1e2d] border border-slate-700 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
            required
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
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#1e1e2d] border border-slate-700 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
            required
          />
        </div>
        {auth.error ? (
          <p className="text-xs text-red-300" role="alert">
            {auth.error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={auth.loading}
          className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 text-white font-medium text-sm transition-colors shadow"
        >
          {auth.loading ? "Memproses..." : "Masuk"}
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
