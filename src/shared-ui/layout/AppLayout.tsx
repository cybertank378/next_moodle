"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ROUTES } from "@/libs/routes";

export interface AppLayoutProps {
  userRole?: string;
  username?: string;
  children: ReactNode;
}

export default function AppLayout({
  userRole = "USER",
  username = "User",
  children,
}: AppLayoutProps) {
  const router = useRouter();

  const getDashboardRoute = (r: string) => {
    switch (r.toUpperCase()) {
      case "ADMIN":
      case "SUPERADMIN":
        return ROUTES.ADMIN.DASHBOARD;
      case "TENANT":
      case "TENANT_ADMIN":
        return ROUTES.TENANT.DASHBOARD;
      case "STUDENT":
        return ROUTES.STUDENT.DASHBOARD;
      default:
        return ROUTES.HOME;
    }
  };

  const dashboardRoute = getDashboardRoute(userRole);

  const handleLogout = () => {
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1e1e2d] text-gray-200">
      {/* App Header Navigation */}
      <header className="h-16 border-b border-slate-800 bg-[#151521] px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => router.push(dashboardRoute)}
            className="text-lg font-bold text-white tracking-wide hover:text-indigo-300 transition-colors"
          >
            Exam SaaS
          </button>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {userRole}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Hai, <strong className="text-gray-200">{username}</strong>
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
