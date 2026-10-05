// Files: src/shared-ui/layout/AppLayout.tsx

"use client";

import { type ReactNode, useState } from "react";
import { Role, type UserRole } from "@/libs/enums";
import AppSidebar from "@/shared-ui/layout/AppSidebar";
import AppTopbar from "@/shared-ui/layout/AppTopbar";

export interface AppLayoutProps {
  children: ReactNode;
  role?: UserRole;
  userRole?: UserRole;
  username?: string;
}

export default function AppLayout({
  children,
  role,
  userRole,
  username,
}: AppLayoutProps) {
  //////////////////////////////////////////////////////////////
  // RESOLVE ACTIVE ROLE
  //////////////////////////////////////////////////////////////

  const activeRole: UserRole = role || userRole || Role.ADMIN;

  //////////////////////////////////////////////////////////////
  // MOBILE SIDEBAR
  //////////////////////////////////////////////////////////////

  const [mobileOpen, setMobileOpen] = useState(false);

  //////////////////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////////////////

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900   transition-colors duration-300">
      {/* SIDEBAR */}
      <AppSidebar
        role={activeRole}
        username={username}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* RIGHT LAYOUT */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOPBAR */}
        <AppTopbar
          role={activeRole}
          username={username}
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50  transition-colors duration-300 relative">
          <div className="absolute inset-0 bg-[url('/images/ilustrator/noise.png')] opacity-10 mix-blend-overlay pointer-events-none hidden "></div>
          <div className="min-h-full px-4 py-6 md:px-6 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
