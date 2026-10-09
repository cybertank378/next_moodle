// Files: src/sections/auth/pages/AuthPage.tsx
"use client";

import type { ReactNode } from "react";
import ChangePasswordForm from "@/sections/auth/organisms/ChangePasswordForm";
import ForgetPasswordForm from "@/sections/auth/organisms/ForgetPasswordForm";
import RegisterForm from "@/sections/auth/organisms/RegisterForm";
import ResetPasswordForm from "@/sections/auth/organisms/ResetPasswordForm";
import VerifyEmailForm from "@/sections/auth/organisms/VerifyEmailForm";
import LoginPageSection from "@/sections/auth/pages/LoginPageSection";

export type AuthMode =
  | "login"
  | "change-password"
  | "forgot-password"
  | "reset-password"
  | "register"
  | "verify-email";

interface Props {
  readonly mode: AuthMode;
}

export default function AuthPage({ mode }: Props) {
  if (mode === "login") {
    return <LoginPageSection />;
  }

  const resolveComponent = (): ReactNode => {
    switch (mode) {
      case "register":
        return <RegisterForm />;
      case "forgot-password":
        return <ForgetPasswordForm />;
      case "change-password":
        return <ChangePasswordForm />;
      case "reset-password":
        return <ResetPasswordForm />;
      case "verify-email":
        return <VerifyEmailForm />;
      default:
        return <LoginPageSection />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">{resolveComponent()}</main>
  );
}
