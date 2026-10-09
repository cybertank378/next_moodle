// Files: src/shared-ui/layout/AppTopbar.tsx

"use client";

import { Bell, LogOut, Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type AvatarMenuItem, getAvatarMenuByRole } from "@/libs/avatarMenu";
import type { UserRole } from "@/libs/enums";
import { roleConfig } from "@/libs/rbacConfig";
import { ROUTES } from "@/libs/routes";
import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";
import { useNotificationApi } from "@/modules/notification/presentation/hooks/useNotificationApi";
import NotificationBadge from "@/sections/notification/atoms/NotificationBadge";
import NotificationPanel from "@/sections/notification/organisms/NotificationPanel";
import Button from "@/shared-ui/component/Button";
import { DropdownItem } from "@/shared-ui/component/DropdownItem";
import SearchField from "@/shared-ui/component/SearchField";


interface Props {
  role: UserRole;
  username?: string;
  onMenuClick?: () => void;
}

export default function AppTopbar({ role, username, onMenuClick }: Props) {
  const router = useRouter();
  const { logout } = useAuthApi();

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [topbarSearch, setTopbarSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { unreadCount, unregisterPush } = useNotificationApi();

  // Get dynamic avatar menu based on role
  const avatarMenu = getAvatarMenuByRole(role);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await unregisterPush();
      await logout();
      router.push(ROUTES.AUTH.LOGIN);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handler);
    }

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [isOpen]);

  const roleMeta = roleConfig[role] || {
    label: role,
    description: "",
  };

  return (
    <header className="sticky top-0 z-40 h-20 bg-white border-b border-slate-100 transition-colors duration-300">
      <div className="h-full px-4 md:px-8 flex items-center justify-between gap-3">
        {/* ================= LEFT SECTION ================= */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500  transition-colors hover:bg-slate-100  hover:text-slate-900  focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
            aria-label="Open sidebar menu"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1 max-w-xl min-w-0">
            <SearchField
              value={topbarSearch}
              onChange={setTopbarSearch}
              placeholder="Cari mata pelajaran, tugas, atau materi..."
              size="md"
            />
          </div>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Figma Design Light/Dark Mode Switch */}
          {/* Theme switch removed as per light theme only constraint */}

          {/* ── NOTIFICATION BELL ── */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              aria-label="Notifikasi"
              aria-expanded={notifOpen}
              aria-controls="notification-panel"
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500  hover:text-slate-900  hover:bg-slate-100  transition-colors"
            >
              <Bell size={18} />
              <NotificationBadge count={unreadCount} />
            </button>

            <NotificationPanel
              isOpen={notifOpen}
              onClose={() => setNotifOpen(false)}
            />
          </div>

          {/* ================= AVATAR ================= */}
          <div className="relative z-50" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="w-9 h-9 rounded-full bg-indigo-600 border border-indigo-400/30 text-white flex items-center justify-center font-bold text-xs uppercase shadow transition hover:opacity-90"
              aria-label="Menu profil"
            >
              {username ? username.charAt(0) : <User size={16} />}
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white/90  backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50  border border-slate-200/60  overflow-hidden text-slate-800 ">
                {/* ===== USER HEADER ===== */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200/60  bg-slate-50/50 ">
                  <div className="relative w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow shrink-0">
                    {username ? username.charAt(0) : <User size={20} />}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white  rounded-full" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900  truncate">
                      {username || "User"}
                    </p>
                    <p className="text-xs text-indigo-600  truncate">
                      {roleMeta.label}
                    </p>
                  </div>
                </div>

                {/* ===== DYNAMIC MENU ===== */}
                <div className="py-2">
                  {avatarMenu.map((item: AvatarMenuItem) => {
                    if ("action" in item && item.action === "logout") {
                      return null;
                    }

                    if ("path" in item) {
                      return (
                        <DropdownItem
                          key={item.path}
                          icon={item.icon}
                          label={item.label}
                          onClick={() => {
                            router.push(item.path);
                            setIsOpen(false);
                          }}
                        />
                      );
                    }

                    return null;
                  })}
                </div>

                <div className="border-t border-slate-200 " />

                {/* ===== LOGOUT BUTTON ===== */}
                <div className="p-3">
                  <Button
                    type="button"
                    onClick={handleLogout}
                    loading={loading}
                    variant="filled"
                    color="error"
                    leftIcon={LogOut}
                    className="w-full"
                  >
                    {loading ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
