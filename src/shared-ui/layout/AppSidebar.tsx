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
import { Role, type UserRole } from "@/libs/enums";
import { PERMISSIONS } from "@/libs/permissions";
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
    case Role.ADMIN:
      return [
        {
          label: "Menu Utama",
          items: [
            {
              label: "Dashboard",
              path: ROUTES.ADMIN.ROOT,
              icon: LayoutDashboard,
            },
            {
              label: "Manajemen Tenant",
              path: ROUTES.ADMIN.TENANTS,
              icon: Users,
              permission: PERMISSIONS.TENANT_MANAGE,
            },
          ],
        },
        {
          label: "Sistem & Audit",
          items: [
            {
              label: "Log Audit",
              path: ROUTES.ADMIN.AUDIT,
              icon: ShieldCheck,
            },
            {
              label: "Pengaturan",
              path: ROUTES.ADMIN.SETTINGS,
              icon: Settings,
            },
          ],
        },
      ];

    case Role.TENANT:
      return [
        {
          label: "Menu Utama",
          items: [
            {
              label: "Dashboard",
              path: ROUTES.TENANT.ROOT,
              icon: LayoutDashboard,
            },
            {
              label: "Pengguna & Grup",
              path: ROUTES.TENANT.USERS,
              icon: Users,
              permission: PERMISSIONS.USER_MANAGE,
              children: [
                {
                  label: "Daftar Pengguna",
                  path: ROUTES.TENANT.USERS,
                  permission: PERMISSIONS.USER_MANAGE,
                },
                {
                  label: "Enrolment Manual",
                  path: ROUTES.TENANT.ENROLMENTS,
                  permission: PERMISSIONS.USER_MANAGE,
                },
                {
                  label: "Rombel & Grup",
                  path: ROUTES.TENANT.GROUPS,
                  permission: PERMISSIONS.USER_MANAGE,
                },
              ],
            },
            {
              label: "Mata Pelajaran & Bank Soal",
              path: ROUTES.TENANT.COURSES,
              icon: BookOpen,
              permission: PERMISSIONS.EXAM_MANAGE,
              children: [
                {
                  label: "Mata Pelajaran",
                  path: ROUTES.TENANT.COURSES,
                  permission: PERMISSIONS.EXAM_MANAGE,
                },
                {
                  label: "Bank Soal",
                  path: ROUTES.TENANT.QUESTIONS,
                  permission: PERMISSIONS.EXAM_MANAGE,
                },
              ],
            },
            {
              label: "Ujian & Hasil",
              path: ROUTES.TENANT.EXAMS,
              icon: FileText,
              permission: PERMISSIONS.EXAM_MANAGE,
              children: [
                {
                  label: "Jadwal Ujian",
                  path: ROUTES.TENANT.EXAMS,
                  permission: PERMISSIONS.EXAM_MANAGE,
                },
                {
                  label: "Hasil & Nilai",
                  path: ROUTES.TENANT.RESULTS,
                  permission: PERMISSIONS.RESULT_VIEW_ALL,
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
              path: ROUTES.TENANT.BRANDING,
              icon: Palette,
            },
            {
              label: "Log Audit",
              path: ROUTES.TENANT.AUDIT,
              icon: ShieldCheck,
            },
          ],
        },
      ];

    case Role.STUDENT:
      return [
        {
          label: "Menu Utama",
          items: [
            {
              label: "Dashboard",
              path: ROUTES.STUDENT.ROOT,
              icon: LayoutDashboard,
            },
            {
              label: "Mata Pelajaran",
              path: ROUTES.STUDENT.COURSES,
              icon: BookOpen,
            },
            {
              label: "Jadwal Ujian",
              path: ROUTES.STUDENT.EXAMS,
              icon: FileText,
              permission: PERMISSIONS.EXAM_TAKE,
            },
            {
              label: "Hasil & Nilai",
              path: ROUTES.STUDENT.RESULTS,
              icon: Award,
              permission: PERMISSIONS.RESULT_VIEW_OWN,
            },
          ],
        },
      ];

    case Role.TEACHER:
      return [
        {
          label: "Menu Utama",
          items: [
            {
              label: "Dashboard Guru",
              path: ROUTES.TEACHER.ROOT,
              icon: LayoutDashboard,
            },
            {
              label: "Mata Pelajaran",
              path: ROUTES.TEACHER.COURSES,
              icon: BookOpen,
            },
            {
              label: "Bank Soal",
              path: ROUTES.TEACHER.QUESTIONS,
              icon: FileText,
            },
            {
              label: "Hasil & Penilaian",
              path: ROUTES.TEACHER.RESULTS,
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
    <div className="flex h-screen w-72 flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-r border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
      <div className="border-b border-slate-200/60 dark:border-slate-800/60 px-5 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <GraduationCap size={28} />
          </div>

          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              Exam SaaS
            </h1>
            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              Platform Ujian Terpusat
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 shadow-sm dark:shadow-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <LayoutDashboard size={18} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Role Aktif
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {role.replaceAll("_", " ")}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 px-3 py-5">
        <div className="space-y-7">
          {groups.map((group, index) => (
            <div key={`group-${group.label ?? index}`}>
              {group.label && (
                <div className="mb-3 px-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
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

      <div className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 px-5 py-4">
        <div className="rounded-2xl px-4 py-2">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
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
