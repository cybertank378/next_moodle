"use client";

import { CheckCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ROUTES } from "@/libs/routes";
import AuthTextField from "@/sections/auth/atoms/AuthTextField";
import AuthFrame from "@/sections/auth/organisms/AuthFrame";
import Button from "@/shared-ui/component/Button";

export default function ForgetPasswordForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (identifier.trim()) setSuccess(true);
  }
  return (
    <AuthFrame
      title="Lupa Password"
      description="Masukkan username atau email untuk menerima instruksi reset."
    >
      {success ? (
        <div className="space-y-5 text-center">
          <CheckCircle className="mx-auto h-14 w-14 text-emerald-500" />
          <p className="text-[#66739f]">
            Jika akun terdaftar, instruksi reset telah dikirim.
          </p>
          <Button
            fullWidth
            size="lg"
            onClick={() => router.push(ROUTES.AUTH.LOGIN)}
          >
            Kembali ke Login
          </Button>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthTextField
            error={
              submitted && !identifier ? "Username atau email wajib diisi" : ""
            }
            label="Username / Email"
            leftIcon={User}
            onChangeAction={setIdentifier}
            placeholder="Masukkan username atau email"
            required
            touched={submitted}
            value={identifier}
          />
          <div className="rounded-2xl border border-[#dfe3f0] bg-white p-4 text-sm text-[#66739f]">
            Link reset memiliki batas waktu. Periksa folder spam bila email
            belum diterima.
          </div>
          <Button fullWidth size="lg" type="submit">
            Kirim Link Reset
          </Button>
          <p className="text-center text-sm text-[#79809d]">
            Sudah ingat password?{" "}
            <Button
              onClick={() => router.push(ROUTES.AUTH.LOGIN)}
              size="sm"
              variant="text"
            >
              Masuk
            </Button>
          </p>
        </form>
      )}
    </AuthFrame>
  );
}
