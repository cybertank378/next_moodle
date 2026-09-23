import type { LucideIcon } from "lucide-react";
import { Award, FileText, Home, LogOut, Settings, Users } from "lucide-react";
import type { UserRole } from "@/libs/enums";
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
    case "ADMIN":
      return [
        {
          type: "link",
          label: "Dashboard",
          path: ROUTES.DASHBOARD.ROOT,
          icon: Home,
        },
        {
          type: "link",
          label: "Tenant",
          path: ROUTES.DASHBOARD.TENANTS,
          icon: Users,
        },
        {
          type: "link",
          label: "Pengaturan",
          path: ROUTES.DASHBOARD.SETTINGS,
          icon: Settings,
        },
        { type: "action", label: "Logout", action: "logout", icon: LogOut },
      ];
    case "TENANT":
      return [
        {
          type: "link",
          label: "Dashboard",
          path: ROUTES.DASHBOARD.ROOT,
          icon: Home,
        },
        {
          type: "link",
          label: "Pengguna",
          path: ROUTES.DASHBOARD.USERS,
          icon: Users,
        },
        {
          type: "link",
          label: "Ujian",
          path: ROUTES.DASHBOARD.EXAMS,
          icon: FileText,
        },
        {
          type: "link",
          label: "Hasil Ujian",
          path: ROUTES.DASHBOARD.RESULTS,
          icon: Award,
        },
        { type: "action", label: "Logout", action: "logout", icon: LogOut },
      ];
    case "STUDENT":
      return [
        {
          type: "link",
          label: "Dashboard",
          path: ROUTES.DASHBOARD.ROOT,
          icon: Home,
        },
        {
          type: "link",
          label: "Ujian Saya",
          path: ROUTES.DASHBOARD.EXAMS,
          icon: FileText,
        },
        {
          type: "link",
          label: "Hasil Nilai",
          path: ROUTES.DASHBOARD.RESULTS,
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
