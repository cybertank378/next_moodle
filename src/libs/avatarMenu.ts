import type { LucideIcon } from "lucide-react";
import { Award, FileText, Home, LogOut, Settings, Users } from "lucide-react";
import { Role, type UserRole } from "@/libs/enums";
import { ROUTES } from "@/libs/routes";

export type LinkMenuItem = {
  type: "link";
  label: string;
  path: string;
  icon: LucideIcon;
};

export type ActionMenuItem = {
  type: "action";
  label: string;
  action: "logout";
  icon: LucideIcon;
};

export type AvatarMenuItem = LinkMenuItem | ActionMenuItem;

export function getAvatarMenuByRole(role: UserRole): AvatarMenuItem[] {
  switch (role) {
    case Role.ADMIN:
      return [
        {
          type: "link",
          label: "Dashboard",
          path: ROUTES.ADMIN.ROOT,
          icon: Home,
        },
        {
          type: "link",
          label: "Tenant",
          path: ROUTES.ADMIN.TENANTS,
          icon: Users,
        },
        {
          type: "link",
          label: "Pengaturan",
          path: ROUTES.ADMIN.SETTINGS,
          icon: Settings,
        },
        { type: "action", label: "Logout", action: "logout", icon: LogOut },
      ];
    case Role.TENANT:
      return [
        {
          type: "link",
          label: "Dashboard",
          path: ROUTES.TENANT.ROOT,
          icon: Home,
        },
        {
          type: "link",
          label: "Pengguna",
          path: ROUTES.TENANT.USERS,
          icon: Users,
        },
        {
          type: "link",
          label: "Ujian",
          path: ROUTES.TENANT.EXAMS,
          icon: FileText,
        },
        {
          type: "link",
          label: "Hasil Ujian",
          path: ROUTES.TENANT.RESULTS,
          icon: Award,
        },
        { type: "action", label: "Logout", action: "logout", icon: LogOut },
      ];
    case Role.STUDENT:
      return [
        {
          type: "link",
          label: "Dashboard",
          path: ROUTES.STUDENT.ROOT,
          icon: Home,
        },
        {
          type: "link",
          label: "Ujian Saya",
          path: ROUTES.STUDENT.EXAMS,
          icon: FileText,
        },
        {
          type: "link",
          label: "Hasil Nilai",
          path: ROUTES.STUDENT.RESULTS,
          icon: Award,
        },
        { type: "action", label: "Logout", action: "logout", icon: LogOut },
      ];
    case Role.TEACHER:
      return [
        {
          type: "link",
          label: "Dashboard",
          path: ROUTES.TEACHER.ROOT,
          icon: Home,
        },
        {
          type: "link",
          label: "Bank Soal",
          path: ROUTES.TEACHER.QUESTIONS,
          icon: FileText,
        },
        {
          type: "link",
          label: "Nilai Kelas",
          path: ROUTES.TEACHER.RESULTS,
          icon: Award,
        },
        { type: "action", label: "Logout", action: "logout", icon: LogOut },
      ];
    default:
      return [
        { type: "link", label: "Beranda", path: ROUTES.HOME, icon: Home },
        { type: "action", label: "Logout", action: "logout", icon: LogOut },
      ];
  }
}
