// Files: src/sections/auth/organisms/LoginForm.tsx
"use client";

import { AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ROUTES } from "@/libs/routes";
import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";
import AuthBrand from "@/sections/auth/atoms/AuthBrand";
import LoginFooter from "@/sections/auth/molecules/LoginFooter";
import LoginFormFields from "@/sections/auth/molecules/LoginFormFields";
import LoginHelpPanel from "@/sections/auth/molecules/LoginHelpPanel";
import Button from "@/shared-ui/component/Button";

export default function LoginForm() {
  const router = useRouter();
  const auth = useAuthApi();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const identifierError =
    submitted && !identifier.trim() ? "Nama pengguna wajib diisi" : "";
  const passwordError = submitted && !password ? "Kata sandi wajib diisi" : "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const trimmedUsername = identifier.trim();
    const hasIdentifierError = !trimmedUsername;
    const hasPasswordError = !password;

    if (hasIdentifierError || hasPasswordError || auth.loading) {
      return;
    }

    try {
      await auth.login({ username: trimmedUsername, password });
      router.push(ROUTES.HOME);
      router.refresh();
    } catch {
      // The hook exposes a safe, user-facing error message.
    }
  }

  return (
    <div className="w-full max-w-[420px] mx-auto flex flex-col justify-between py-6 px-4 sm:px-0">
      {/* Mobile top logo (visible on mobile only) */}
      <div className="lg:hidden mb-6 flex items-center justify-between">
        <AuthBrand className="dark:hidden" size="md" surfaceTone="light" />
        <AuthBrand className="hidden dark:flex" size="md" surfaceTone="dark" />
      </div>

      {/* Header section: Welcome badge and title */}
      <div className="mb-6 text-left">
        <div className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-3">
          SELAMAT DATANG
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Masuk ke akun Anda
        </h2>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-400">
          Gunakan akun yang diberikan sekolah atau administrator.
        </p>
      </div>

      {/* Login form */}
      <form
        className="space-y-4"
        method="post"
        noValidate
        onSubmit={handleSubmit}
      >
        <LoginFormFields
          disabled={auth.loading}
          identifier={identifier}
          identifierError={identifierError}
          onChangeIdentifier={setIdentifier}
          onChangePassword={setPassword}
          password={password}
          passwordError={passwordError}
          submitted={submitted}
        />

        {/* Forgot password link */}
        <div className="flex justify-end pt-1">
          <button
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors cursor-pointer"
            onClick={() => router.push(ROUTES.AUTH.FORGOT_PASSWORD)}
            type="button"
          >
            Lupa kata sandi?
          </button>
        </div>

        {/* Safe error banner */}
        {auth.error ? (
          <div
            aria-live="polite"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
            role="alert"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 shrink-0"
              size={16}
            />
            <p className="font-medium">{auth.error}</p>
          </div>
        ) : null}

        {/* Submit button */}
        <Button
          className="mt-4 h-12 w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
          disabled={auth.loading}
          fullWidth
          loading={auth.loading}
          size="lg"
          type="submit"
        >
          <span>Masuk</span>
          <ArrowRight aria-hidden="true" size={16} />
        </Button>
      </form>

      {/* Help panel */}
      <div className="mt-6">
        <LoginHelpPanel />
      </div>

      {/* Terms and Privacy policy statement */}
      <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 leading-relaxed select-none">
        Dengan masuk, Anda menyetujui
        <br />
        <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
          Ketentuan Penggunaan
        </span>{" "}
        dan{" "}
        <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
          Kebijakan Privasi
        </span>
        .
      </p>

      {/* Footer */}
      <div className="mt-6">
        <LoginFooter />
      </div>
    </div>
  );
}
