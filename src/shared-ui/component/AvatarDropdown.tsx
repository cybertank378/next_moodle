// src/shared-ui/component/AvatarDropdown.tsx

"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type AvatarMenuItem, getAvatarMenuByRole } from "@/libs/avatarMenu";
import type { UserRole } from "@/libs/enums";
import { ROUTES } from "@/libs/routes";
import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";
import Button from "@/shared-ui/component/Button";
import { DropdownItem } from "@/shared-ui/component/DropdownItem";

//////////////////////////////////////////////////////////////
// PROPS
//////////////////////////////////////////////////////////////

interface Props {
  role: UserRole;
}

//////////////////////////////////////////////////////////////
// AVATAR DROPDOWN
//////////////////////////////////////////////////////////////

export default function AvatarDropdown({ role }: Props) {
  //////////////////////////////////////////////////////////////
  // ROUTER
  //////////////////////////////////////////////////////////////

  const router = useRouter();

  //////////////////////////////////////////////////////////////
  // AUTH API
  //////////////////////////////////////////////////////////////

  const { logout, loading } = useAuthApi();

  //////////////////////////////////////////////////////////////
  // MENU
  //////////////////////////////////////////////////////////////

  const menu = getAvatarMenuByRole(role);

  //////////////////////////////////////////////////////////////
  // LOCAL LOADING
  //////////////////////////////////////////////////////////////

  const [isSubmitting, setIsSubmitting] = useState(false);

  //////////////////////////////////////////////////////////////
  // LOGOUT
  //////////////////////////////////////////////////////////////

  const handleLogout = async () => {
    try {
      setIsSubmitting(true);
      await logout();
      router.push(ROUTES.AUTH.LOGIN);
      router.refresh();
    } catch (error) {
      console.error("[LOGOUT_ERROR]", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  //////////////////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////////////////

  return (
    <>
      {/* MENU */}
      <div className="py-2">
        {menu.map((item: AvatarMenuItem) => {
          if ("action" in item) {
            return null;
          }

          return (
            <DropdownItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              onClick={() => {
                router.push(item.path);
              }}
            />
          );
        })}
      </div>

      {/* DIVIDER */}
      <div className="border-t border-border-default" />

      {/* LOGOUT */}
      <div className="p-4">
        <Button
          type="button"
          variant="filled"
          color="error"
          className="w-full"
          leftIcon={LogOut}
          loading={loading || isSubmitting}
          onClick={handleLogout}
        >
          {loading || isSubmitting ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </>
  );
}
