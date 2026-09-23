"use client";

import { CheckCircle, Lock, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ROUTES } from "@/libs/routes";
import AuthTextField from "@/sections/auth/atoms/AuthTextField";
import AuthFrame from "@/sections/auth/organisms/AuthFrame";
import Button from "@/shared-ui/component/Button";

export default function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (
      currentPassword &&
      newPassword.length >= 6 &&
      newPassword === confirmPassword
    )
      setSuccess(true);
  }
  return (
    <AuthFrame
      title="Ganti Kata Sandi"
      description="Perbarui kata sandi untuk menjaga keamanan akun Anda."
    >
      {success ? (
        <div className="space-y-5 text-center">
          <CheckCircle className="mx-auto h-14 w-14 text-emerald-500" />
          <p className="text-[#66739f]">Kata sandi berhasil diperbarui.</p>
          <Button fullWidth size="lg" onClick={() => router.push(ROUTES.HOME)}>
            Kembali ke Beranda
          </Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
            <Shield className="h-5 w-5 shrink-0" />
            Gunakan kata sandi yang kuat dan tidak mudah ditebak.
          </div>
          <AuthTextField
            error={
              submitted && !currentPassword
                ? "Kata sandi saat ini wajib diisi"
                : ""
            }
            label="Kata Sandi Saat Ini"
            leftIcon={Lock}
            onChangeAction={setCurrentPassword}
            required
            touched={submitted}
            type="password"
            value={currentPassword}
          />
          <AuthTextField
            error={
              submitted && newPassword.length < 6 ? "Minimal 6 karakter" : ""
            }
            label="Kata Sandi Baru"
            leftIcon={Lock}
            onChangeAction={setNewPassword}
            required
            touched={submitted}
            type="password"
            value={newPassword}
          />
          <AuthTextField
            error={
              submitted && newPassword !== confirmPassword
                ? "Konfirmasi kata sandi tidak cocok"
                : ""
            }
            label="Konfirmasi Kata Sandi"
            leftIcon={Lock}
            onChangeAction={setConfirmPassword}
            required
            touched={submitted}
            type="password"
            value={confirmPassword}
          />
          <Button fullWidth size="lg" type="submit">
            Simpan Kata Sandi
          </Button>
        </form>
      )}
    </AuthFrame>
  );
}
