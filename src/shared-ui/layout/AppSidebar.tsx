// Files: src/shared-ui/layout/AppSidebar.tsx

"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BookOpen,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Palette,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { UserRole } from "@/libs/enums";
import { ROUTES } from "@/libs/routes";
import {
  RecursiveSidebarItem,
  type SidebarItem,
} from "@/shared-ui/layout/sidebar/RecursiveSidebarItem";

export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

export function getSidebarMenu(role: UserRole): SidebarGroup[] {
  switch (role) {
    case "ADMIN":
      return [
        {
          label: "Menu Utama",
          items: [
            {
              label: "Dashboard",
              path: ROUTES.DASHBOARD.ROOT,
              icon: LayoutDashboard,
            },
            {
              label: "Manajemen Tenant",
              path: ROUTES.DASHBOARD.TENANTS,
              icon: Users,
            },
          ],
        },
        {
          label: "Sistem & Audit",
          items: [
            {
              label: "Log Audit",
              path: ROUTES.DASHBOARD.AUDIT,
              icon: ShieldCheck,
            },
            {
              label: "Pengaturan",
              path: ROUTES.DASHBOARD.SETTINGS,
              icon: Settings,
            },
          ],
        },
      ];

    case "TENANT":
      return [
        {
          label: "Menu Utama",
          items: [
            {
              label: "Dashboard",
              path: ROUTES.DASHBOARD.ROOT,
              icon: LayoutDashboard,
            },
            {
              label: "Pengguna & Grup",
              path: ROUTES.DASHBOARD.USERS,
              icon: Users,
              children: [
                {
                  label: "Daftar Pengguna",
                  path: ROUTES.DASHBOARD.USERS,
                },
                {
                  label: "Enrolment Manual",
                  path: ROUTES.DASHBOARD.ENROLMENTS,
                },
                {
                  label: "Rombel & Grup",
                  path: ROUTES.DASHBOARD.GROUPS,
                },
              ],
            },
            {
              label: "Kursus & Bank Soal",
              path: ROUTES.DASHBOARD.COURSES,
              icon: BookOpen,
              children: [
                {
                  label: "Mata Pelajaran",
                  path: ROUTES.DASHBOARD.COURSES,
                },
                {
                  label: "Bank Soal",
                  path: ROUTES.DASHBOARD.QUESTIONS,
                },
              ],
            },
            {
              label: "Ujian & Hasil",
              path: ROUTES.DASHBOARD.EXAMS,
              icon: FileText,
              children: [
                {
                  label: "Jadwal Ujian",
                  path: ROUTES.DASHBOARD.EXAMS,
                },
                {
                  label: "Hasil & Nilai",
                  path: ROUTES.DASHBOARD.RESULTS,
                },
              ],
            },
          ],
        },
        {
          label: "Pengaturan",
          items: [
            {
              label: "Branding",
              path: ROUTES.DASHBOARD.BRANDING,
              icon: Palette,
            },
            {
              label: "Log Audit",
              path: ROUTES.DASHBOARD.AUDIT,
              icon: ShieldCheck,
            },
          ],
        },
      ];

    case "STUDENT":
      return [
        {
          label: "Menu Utama",
          items: [
            {
              label: "Dashboard",
              path: ROUTES.DASHBOARD.ROOT,
              icon: LayoutDashboard,
            },
            {
              label: "Mata Pelajaran",
              path: ROUTES.DASHBOARD.COURSES,
              icon: BookOpen,
            },
            {
              label: "Jadwal Ujian",
              path: ROUTES.DASHBOARD.EXAMS,
              icon: FileText,
            },
            {
              label: "Hasil & Nilai",
              path: ROUTES.DASHBOARD.RESULTS,
              icon: Award,
            },
          ],
        },
      ];

    default:
      return [];
  }
}

interface Props {
  role: UserRole;
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AppSidebar({ role, mobileOpen, onClose }: Props) {
  const groups = getSidebarMenu(role);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const sidebarContent = (
    <div className="flex h-screen w-72 flex-col bg-sky-950 text-slate-200">
      <div className="border-b border-slate-700 px-5 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-indigo-600 text-white shadow-md">
            <GraduationCap size={28} />
          </div>

          <div>
            <h1 className="text-base font-bold tracking-wide text-white">
              Exam SaaS
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              Platform Ujian Terpusat
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-700 bg-sky-900/60 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow">
            <LayoutDashboard size={18} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
              Role Aktif
            </p>
            <p className="text-sm font-semibold text-white">
              {role.replaceAll("_", " ")}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto bg-sky-950 px-3 py-5">
        <div className="space-y-7">
          {groups.map((group, index) => (
            <div key={`group-${group.label ?? index}`}>
              {group.label && (
                <div className="mb-3 px-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {group.label}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <RecursiveSidebarItem
                    key={
                      item.path ??
                      `${group.label ?? "group"}-${item.label}-${itemIndex}`
                    }
                    item={item}
                    role={role}
                    onNavigate={onClose}
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-700 bg-sky-950 px-5 py-4">
        <div className="rounded-2xl px-4 py-2">
          <p className="text-xs font-medium text-slate-400">
            © {new Date().getFullYear()} Exam SaaS Moodle
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex">{sidebarContent}</aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.aside
              className="fixed left-0 top-0 z-50 md:hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 26,
              }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
