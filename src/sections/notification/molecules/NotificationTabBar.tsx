"use client";

import type { NotificationTab } from "@/modules/notification/domain/types/NotificationTypes";
import Button from "@/shared-ui/component/Button";

interface NotificationTabBarProps {
  activeTab: NotificationTab;
  unreadCount: number;
  onTabChange: (tab: NotificationTab) => void;
}

export default function NotificationTabBar({
  activeTab,
  unreadCount,
  onTabChange,
}: NotificationTabBarProps) {
  const tabs: { key: NotificationTab; label: string }[] = [
    { key: "unread", label: "Belum Dibaca" },
    { key: "read", label: "Sudah Dibaca" },
  ];

  return (
    <div className="flex border-b border-slate-200 ">
      {tabs.map((tab) => {
        const handleTabClick = () => {
          onTabChange(tab.key);
        };
        return (
          <Button
            key={tab.key}
            type="button"
            variant="ghost"
            size="sm"
            data-testid={`notification-tab-${tab.key}`}
            onClick={handleTabClick}
            className={[
              "flex-1 py-2.5 text-sm font-medium transition-colors relative rounded-none h-auto hover:bg-transparent",
              activeTab === tab.key
                ? "text-indigo-600 font-semibold"
                : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
          >
            <span>{tab.label}</span>
            {tab.key === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full" />
            )}
          </Button>
        );
      })}
    </div>
  );
}
