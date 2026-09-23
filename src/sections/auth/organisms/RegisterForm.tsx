"use client";

import { Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ROUTES } from "@/libs/routes";
import AuthCheckbox from "@/sections/auth/atoms/AuthCheckbox";
import AuthTextField from "@/sections/auth/atoms/AuthTextField";
import TermsConditionsModal from "@/sections/auth/molecules/TermsConditionsModal";
import AuthFrame from "@/sections/auth/organisms/AuthFrame";
import Button from "@/shared-ui/component/Button";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!name || !email || password.length < 6 || !agree) return;
    router.push(ROUTES.AUTH.LOGIN);
  }
  return (
    <>
      <AuthFrame
        title="Buat Akun"
        description="Daftarkan akun Anda untuk melanjutkan."
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <AuthTextField
            error={submitted && !name ? "Nama lengkap wajib diisi" : ""}
            label="Nama Lengkap"
            leftIcon={User}
            onChangeAction={setName}
            required
            touched={submitted}
            value={name}
          />
          <AuthTextField
            error={submitted && !email ? "Email wajib diisi" : ""}
            label="Email"
            leftIcon={Mail}
            onChangeAction={setEmail}
            required
            touched={submitted}
            type="email"
            value={email}
          />
          <AuthTextField
            error={submitted && password.length < 6 ? "Minimal 6 karakter" : ""}
            label="Kata Sandi"
            onChangeAction={setPassword}
            required
            touched={submitted}
            type="password"
            value={password}
          />
          <div className="space-y-2">
            <AuthCheckbox
              checked={agree}
              label="Saya menyetujui syarat dan ketentuan"
              onChangeAction={(value) =>
                value ? setTermsOpen(true) : setAgree(false)
              }
            />
            {submitted && !agree ? (
              <p className="text-xs text-red-500">
                Wajib menyetujui syarat dan ketentuan
              </p>
            ) : null}
          </div>
          <Button disabled={!agree} fullWidth size="lg" type="submit">
            Daftar
          </Button>
          <p className="text-center text-sm text-[#79809d]">
            Sudah punya akun?{" "}
            <Button
              onClick={() => router.push(ROUTES.AUTH.LOGIN)}
              size="sm"
              variant="text"
            >
              Masuk
            </Button>
          </p>
        </form>
      </AuthFrame>
      <TermsConditionsModal
        onAgree={() => {
          setAgree(true);
          setTermsOpen(false);
        }}
        onClose={() => setTermsOpen(false)}
        open={termsOpen}
      />
    </>
  );
}
