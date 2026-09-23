"use client";

import { Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ROUTES } from "@/libs/routes";
import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";
import AuthCheckbox from "@/sections/auth/atoms/AuthCheckbox";
import AuthTextField from "@/sections/auth/atoms/AuthTextField";
import AuthFrame from "@/sections/auth/organisms/AuthFrame";
import Button from "@/shared-ui/component/Button";

export default function LoginForm() {
  const router = useRouter();
  const auth = useAuthApi();
  const [tenant, setTenant] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const identifierError =
    submitted && !identifier.trim() ? "Username atau email wajib diisi" : "";
  const passwordError = submitted && !password ? "Kata sandi wajib diisi" : "";
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!tenant.trim() || identifierError || passwordError) return;
    try {
      await auth.login({ tenant, username: identifier, password });
      router.push(ROUTES.DASHBOARD.ROOT);
      router.refresh();
    } catch {
      // The hook exposes a safe, user-facing error message.
    }
  }
  return (
    <AuthFrame
      title="Selamat Datang"
      description="Masuk untuk melanjutkan ke platform ujian."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthTextField
          error={submitted && !tenant.trim() ? "Tenant wajib diisi" : ""}
          label="Tenant"
          onChangeAction={setTenant}
          placeholder="contoh: acme"
          required
          touched={submitted}
          value={tenant}
        />
        <AuthTextField
          error={identifierError}
          label="Username / Email"
          leftIcon={User}
          onChangeAction={setIdentifier}
          placeholder="Masukkan username atau email"
          required
          touched={submitted}
          value={identifier}
        />
        <AuthTextField
          error={passwordError}
          label="Kata Sandi"
          leftIcon={Lock}
          onChangeAction={setPassword}
          placeholder="Masukkan kata sandi"
          required
          touched={submitted}
          type="password"
          value={password}
        />
        <div className="flex items-center justify-between">
          <AuthCheckbox
            checked={remember}
            label="Ingat saya"
            onChangeAction={setRemember}
          />
          <Button
            onClick={() => router.push(ROUTES.AUTH.FORGOT_PASSWORD)}
            size="sm"
            variant="text"
          >
            Lupa kata sandi?
          </Button>
        </div>
        <Button fullWidth size="lg" type="submit">
          {auth.loading ? "Memproses..." : "Masuk"}
        </Button>
        {auth.error ? (
          <p className="text-center text-sm text-red-600">{auth.error}</p>
        ) : null}
        <p className="text-center text-sm text-[#79809d]">
          Belum punya akun?{" "}
          <Button
            onClick={() => router.push(ROUTES.AUTH.REGISTER)}
            size="sm"
            variant="text"
          >
            Daftar
          </Button>
        </p>
      </form>
    </AuthFrame>
  );
}
