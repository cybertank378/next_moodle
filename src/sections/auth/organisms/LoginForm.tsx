// Files: src/sections/auth/organisms/LoginForm.tsx
"use client";

import { AlertCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ROUTES } from "@/libs/routes";
import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";
import AuthBrand from "@/sections/auth/atoms/AuthBrand";
import LoginFooter from "@/sections/auth/molecules/LoginFooter";
import LoginFormFields from "@/sections/auth/molecules/LoginFormFields";
import LoginHelpPanel from "@/sections/auth/molecules/LoginHelpPanel";
import Button from "@/shared-ui/component/Button";
import ThemeSwitch from "@/shared-ui/component/ThemeSwitch";

export default function LoginForm() {
  const router = useRouter();
  const auth = useAuthApi();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const identifierError =
    submitted && !identifier.trim() ? "Username wajib diisi" : "";
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
      {/* Top action row: Mobile logo and Theme Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div className="lg:hidden">
          <AuthBrand size="md" variant="dark" />
        </div>
        <div className="ml-auto">
          <ThemeSwitch size="sm" />
        </div>
      </div>

      {/* Header section: Welcome badge and title */}
      <div className="mb-8 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
          <Sparkles aria-hidden="true" size={13} />
          <span>Selamat Datang</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Masuk ke akun Anda
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Gunakan akun yang diberikan sekolah atau administrator.
        </p>
      </div>

      {/* Login form */}
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
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
          className="mt-2 h-12 w-full text-base font-semibold shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.99] transition-all"
          disabled={auth.loading}
          fullWidth
          loading={auth.loading}
          size="lg"
          type="submit"
        >
          {auth.loading ? "Memproses..." : "Masuk"}
        </Button>
      </form>

      {/* Help panel */}
      <div className="mt-8">
        <LoginHelpPanel />
      </div>

      {/* Footer */}
      <div className="mt-8">
        <LoginFooter />
      </div>
    </div>
  );
}
