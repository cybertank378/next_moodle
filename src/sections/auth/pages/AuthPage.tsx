"use client";

import type { ReactNode } from "react";
import ChangePasswordForm from "@/sections/auth/organisms/ChangePasswordForm";
import ForgetPasswordForm from "@/sections/auth/organisms/ForgetPasswordForm";
import LoginForm from "@/sections/auth/organisms/LoginForm";
import RegisterForm from "@/sections/auth/organisms/RegisterForm";
import ResetPasswordForm from "@/sections/auth/organisms/ResetPasswordForm";
import VerifyEmailForm from "@/sections/auth/organisms/VerifyEmailForm";

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
  const resolveComponent = (): ReactNode => {
    switch (mode) {
      case "login":
        return <LoginForm />;
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
        return <LoginForm />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">{resolveComponent()}</main>
  );
}
