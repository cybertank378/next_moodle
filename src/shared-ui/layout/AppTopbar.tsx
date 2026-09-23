// Files: src/shared-ui/layout/AppTopbar.tsx

"use client";

import { Bell, LogOut, Menu, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type AvatarMenuItem, getAvatarMenuByRole } from "@/libs/avatarMenu";
import type { UserRole } from "@/libs/enums";
import { roleConfig } from "@/libs/rbacConfig";
import { ROUTES } from "@/libs/routes";
import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";
import Button from "@/shared-ui/component/Button";
import { DropdownItem } from "@/shared-ui/component/DropdownItem";

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get dynamic avatar menu based on role
  const avatarMenu = getAvatarMenuByRole(role);

  const handleLogout = async () => {
    try {
      setLoading(true);
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
    <header className="sticky top-0 z-40 h-16 bg-[#151521] border-b border-slate-800 shadow-sm">
      <div className="h-full px-4 md:px-8 flex items-center justify-between gap-3">
        {/* ================= LEFT SECTION ================= */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
            aria-label="Open sidebar menu"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2 px-3 h-10 border border-slate-700 rounded-lg bg-[#1e1e2d] focus-within:border-indigo-500 transition-colors flex-1 max-w-md min-w-0">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari ujian, mata pelajaran, siswa..."
              className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-500 min-w-0"
            />
          </div>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            aria-label="Notifikasi"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Bell size={18} />
          </button>

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
              <div className="absolute right-0 mt-3 w-64 bg-[#1e1e2d] rounded-xl shadow-2xl border border-slate-700 overflow-hidden text-slate-200">
                {/* ===== USER HEADER ===== */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800 bg-[#151521]">
                  <div className="relative w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow shrink-0">
                    {username ? username.charAt(0) : <User size={20} />}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#151521] rounded-full" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {username || "User"}
                    </p>
                    <p className="text-xs text-indigo-400 truncate">
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

                <div className="border-t border-slate-800" />

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
