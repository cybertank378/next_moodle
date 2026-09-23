"use client";

import { CheckCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ROUTES } from "@/libs/routes";
import AuthTextField from "@/sections/auth/atoms/AuthTextField";
import AuthFrame from "@/sections/auth/organisms/AuthFrame";
import Button from "@/shared-ui/component/Button";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (password.length >= 6 && password === confirmation) setSuccess(true);
  }
  return (
    <AuthFrame
      title="Atur Ulang Password"
      description="Buat kata sandi baru untuk akun Anda."
    >
      {success ? (
        <div className="space-y-5 text-center">
          <CheckCircle className="mx-auto h-14 w-14 text-emerald-500" />
          <p className="text-[#66739f]">Kata sandi baru telah disimpan.</p>
          <Button
            fullWidth
            size="lg"
            onClick={() => router.push(ROUTES.AUTH.LOGIN)}
          >
            Masuk
          </Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <AuthTextField
            error={submitted && password.length < 6 ? "Minimal 6 karakter" : ""}
            label="Kata Sandi Baru"
            leftIcon={Lock}
            onChangeAction={setPassword}
            required
            touched={submitted}
            type="password"
            value={password}
          />
          <AuthTextField
            error={
              submitted && password !== confirmation
                ? "Konfirmasi kata sandi tidak cocok"
                : ""
            }
            label="Konfirmasi Kata Sandi"
            leftIcon={Lock}
            onChangeAction={setConfirmation}
            required
            touched={submitted}
            type="password"
            value={confirmation}
          />
          <Button fullWidth size="lg" type="submit">
            Simpan Kata Sandi
          </Button>
        </form>
      )}
    </AuthFrame>
  );
}
