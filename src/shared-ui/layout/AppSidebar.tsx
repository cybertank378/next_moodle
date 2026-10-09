// Files: src/shared-ui/layout/AppSidebar.tsx

"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Palette,
  Settings,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APP_NAME } from "@/libs/branding";
import { Role, type UserRole } from "@/libs/enums";
import { PERMISSIONS } from "@/libs/permissions";
import { ROUTES } from "@/libs/routes";
import BrandLogo from "@/shared-ui/component/BrandLogo";
import Button from "@/shared-ui/component/Button";
import {
  RecursiveSidebarItem,
  type SidebarItem,
} from "@/shared-ui/layout/sidebar/RecursiveSidebarItem";

export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

function getSidebarHome(role: UserRole): string {
  switch (role) {
    case Role.ADMIN:
      return ROUTES.ADMIN.ROOT;
    case Role.TENANT:
      return ROUTES.TENANT.ROOT;
    case Role.TEACHER:
      return ROUTES.TEACHER.ROOT;
    case Role.STUDENT:
      return ROUTES.STUDENT.ROOT;
    default:
      return ROUTES.HOME;
  }
}

interface RoleIdentity {
  initials: string;
  title: string;
  subtitle: string;
}

function getRoleIdentity(
  role: UserRole,
  username?: string,
  institutionName?: string,
): RoleIdentity {
  switch (role) {
    case Role.ADMIN:
      return {
        initials: username ? username.slice(0, 2).toUpperCase() : "AD",
        title: username ? username.toUpperCase() : "ADMIN",
        subtitle: "Administrator Platform",
      };
    case Role.TENANT:
      return {
        initials: username ? username.slice(0, 2).toUpperCase() : "TN",
        title: username
          ? username.toUpperCase()
          : (institutionName ? institutionName.toUpperCase() : "TENANT"),
        subtitle: "Operator Institusi / Tenant",
      };
    case Role.TEACHER:
      return {
        initials: username ? username.slice(0, 2).toUpperCase() : "GR",
        title: username ? username.toUpperCase() : "GURU",
        subtitle: "Guru / Tenaga Pendidik",
      };
    case Role.STUDENT:
      return {
        initials: username ? username.slice(0, 2).toUpperCase() : "SW",
        title: username ? username.toUpperCase() : "SISWA",
        subtitle: "Siswa / Peserta Didik",
      };
    default:
      return {
        initials: username ? username.slice(0, 2).toUpperCase() : "US",
        title: (role as string).replaceAll("_", " "),
        subtitle: "Pengguna",
      };
  }
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
            {
              label: "Pengelolaan Notifikasi",
              path: ROUTES.ADMIN.NOTIFICATIONS,
              icon: Bell,
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
            {
              label: "Pengumuman",
              path: ROUTES.TENANT.NOTIFICATIONS,
              icon: Bell,
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
              label: "Tugas",
              path: ROUTES.STUDENT.ASSIGNMENTS,
              icon: FileText,
            },
            {
              label: "Kalender",
              path: ROUTES.STUDENT.CALENDAR,
              icon: Calendar,
            },
            {
              label: "Jadwal Pelajaran",
              path: ROUTES.STUDENT.SCHEDULE,
              icon: CalendarDays,
            },
            {
              label: "Hasil & Nilai",
              path: ROUTES.STUDENT.RESULTS,
              icon: Award,
              permission: PERMISSIONS.RESULT_VIEW_OWN,
            },
            {
              label: "Pengumuman",
              path: ROUTES.STUDENT.ANNOUNCEMENTS,
              icon: Megaphone,
            },
            {
              label: "Notifikasi",
              path: ROUTES.STUDENT.NOTIFICATIONS,
              icon: Bell,
              // Ideally there would be a badge here, but we'll add it to the item type if needed
            },
            {
              label: "Aktivitas Terbaru",
              path: ROUTES.STUDENT.ACTIVITIES,
              icon: Clock,
            },
          ],
        },
        {
          label: "LAINNYA",
          items: [
            {
              label: "Profil",
              path: ROUTES.STUDENT.PROFILE,
              icon: User,
            },
            {
              label: "Pengaturan",
              path: ROUTES.STUDENT.SETTINGS,
              icon: Settings,
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
            {
              label: "Notifikasi",
              path: ROUTES.TEACHER.NOTIFICATIONS,
              icon: Bell,
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
  username?: string;
  institutionName?: string;
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AppSidebar({
  role,
  username,
  institutionName,
  mobileOpen,
  onClose,
}: Props) {
  const router = useRouter();
  const groups = getSidebarMenu(role);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleNavigateHome = () => {
    router.push(getSidebarHome(role));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onClose]);

  const renderSidebarContent = (collapsed: boolean) => (
    <div
      className={`flex h-screen flex-col bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="border-b border-slate-800 px-4 py-5">
        <div
          className={
            collapsed
              ? "flex flex-col items-center gap-3"
              : "flex items-center justify-between gap-2"
          }
        >
          <Button
            variant="ghost"
            aria-label={APP_NAME}
            className="flex min-w-0 items-center p-0 h-auto bg-transparent hover:bg-transparent"
            onClick={handleNavigateHome}
          >
            <BrandLogo
              className={collapsed ? "h-10 w-10" : "h-10 w-auto max-w-44"}
              decorative
              preload
              surfaceTone="dark"
              variant={collapsed ? "mark" : "horizontal"}
            />
          </Button>

          {/* Desktop collapse button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconOnly
            leftIcon={collapsed ? ChevronRight : ChevronLeft}
            aria-label={collapsed ? "Perluas sidebar" : "Perkecil sidebar"}
            onClick={handleToggleCollapse}
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
          />

          {/* Mobile close button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconOnly
            leftIcon={X}
            aria-label="Tutup menu sidebar"
            onClick={onClose}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
          />
        </div>

        {/* Role Identity Card */}
        {!collapsed && (() => {
          const identity = getRoleIdentity(role, username, institutionName);
          return (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 font-bold text-xs uppercase shadow-sm">
                {identity.initials}
              </div>

              <div className="overflow-hidden">
                <p className="text-xs font-bold uppercase tracking-wider text-white truncate">
                  {identity.title}
                </p>
                <p className="text-[11px] font-medium text-slate-400 truncate">
                  {identity.subtitle}
                </p>
              </div>
            </div>
          );
        })()}
      </div>

      <nav className="flex-1 overflow-y-auto bg-slate-900 px-3 py-5">
        <div className="space-y-7">
          {groups.map((group, index) => (
            <div key={`group-${group.label ?? index}`}>
              {group.label && !collapsed && (
                <div className="mb-3 px-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
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

      <div className="border-t border-slate-800 bg-slate-900 px-4 py-4">
        {role === Role.ADMIN ? (
          <div className="space-y-3">
            <div
              className={`flex items-center ${
                collapsed ? "justify-center" : "justify-between"
              } rounded-2xl border border-slate-700/60 bg-slate-800/50 p-2.5 shadow-sm`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/30 font-bold text-xs">
                  {username ? username.slice(0, 2).toUpperCase() : "AD"}
                </div>
                {!collapsed && (
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">
                      {username || "Administrator"}
                    </p>
                    <p className="text-[11px] font-medium text-slate-400 truncate">
                      Administrator platform
                    </p>
                  </div>
                )}
              </div>
              {!collapsed && (
                <ChevronDown
                  size={14}
                  className="text-slate-400 shrink-0"
                  aria-hidden="true"
                />
              )}
            </div>

            {!collapsed && (
              <div className="text-center">
                <p className="text-[11px] font-medium text-slate-500">
                  © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                </p>
              </div>
            )}
          </div>
        ) : role === Role.STUDENT || role === Role.TEACHER || role === Role.TENANT ? (
          <div className="flex items-center gap-3 rounded-2xl bg-slate-800/50 p-3 shadow-sm border border-slate-700/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Institusi Pendidikan
                </p>
                <p className="text-xs font-semibold text-white truncate">
                  {institutionName || "Nama sekolah belum tersedia"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl px-4 py-2 text-center">
            <p className="text-xs font-medium text-slate-500">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex">
        {renderSidebarContent(isCollapsed)}
      </aside>

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
              role="dialog"
              aria-modal="true"
              aria-label="Menu navigasi samping"
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
              {renderSidebarContent(false)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
