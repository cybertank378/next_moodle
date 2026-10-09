// Files: src/sections/auth/pages/LoginPageSection.tsx
"use client";

import LoginBrandPanel from "@/sections/auth/organisms/LoginBrandPanel";
import LoginForm from "@/sections/auth/organisms/LoginForm";

export default function LoginPageSection() {
  return (
    <main className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white text-slate-900 lg:flex-row dark:bg-slate-950 dark:text-slate-100">
      {/* Left panel: Navy Educational Branding & Illustration (hidden on mobile/tablet) */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[54%] relative overflow-hidden">
        <LoginBrandPanel />
      </div>

      {/* Right panel: Clean White Form Container */}
      <div className="flex w-full flex-1 flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:w-[45%] xl:w-[46%] bg-white dark:bg-slate-900">
        <LoginForm />
      </div>
    </main>
  );
}
