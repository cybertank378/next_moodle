"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ROUTES } from "@/libs/routes";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(ROUTES.AUTH.LOGIN);
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-[#151521] p-8 shadow-xl">
      <div className="mb-6 text-center">
        <h1 className="mb-1 text-2xl font-bold text-white">Registrasi</h1>
        <p className="text-sm text-gray-400">
          Form registrasi disiapkan sebagai public route. Business flow akun
          akan diimplementasikan pada issue autentikasi terkait.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-xs font-semibold text-gray-300"
          >
            Nama
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-[#1e1e2d] px-3.5 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-xs font-semibold text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-[#1e1e2d] px-3.5 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Lanjutkan
        </button>
      </form>
    </div>
  );
}
