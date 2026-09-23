"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ROUTES } from "@/libs/routes";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-8 rounded-xl bg-[#151521] border border-slate-800 shadow-xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Lupa Kata Sandi</h1>
        <p className="text-sm text-gray-400">
          Hubungi administrator instansi Anda atau masukkan email terdaftar
        </p>
      </div>
      {submitted ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-green-400">
            Instruksi reset telah dikirim jika email terdaftar.
          </p>
          <button
            type="button"
            onClick={() => router.push(ROUTES.AUTH.LOGIN)}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow"
          >
            Kembali ke Halaman Masuk
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@sekolah.sch.id"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1e1e2d] border border-slate-700 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow"
          >
            Kirim Instruksi Reset
          </button>
        </form>
      )}
      <div className="mt-6 text-center text-xs text-gray-400">
        <button
          type="button"
          onClick={() => router.push(ROUTES.AUTH.LOGIN)}
          className="text-indigo-400 hover:underline"
        >
          Kembali ke halaman masuk
        </button>
      </div>
    </div>
  );
}
