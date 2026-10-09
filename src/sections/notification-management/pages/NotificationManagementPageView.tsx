// Files: src/sections/notification-management/pages/NotificationManagementPageView.tsx
"use client";

import { useState } from "react";
import NotificationCampaignDetailView from "@/sections/notification-management/organisms/NotificationCampaignDetailView";
import NotificationCampaignFormView from "@/sections/notification-management/organisms/NotificationCampaignFormView";
import NotificationManagementView from "@/sections/notification-management/organisms/NotificationManagementView";

interface Props {
  actorRole: "ADMIN" | "TENANT";
}

type ViewMode = "LIST" | "CREATE" | "EDIT" | "DETAIL";

export default function NotificationManagementPageView({ actorRole }: Props) {
  const [mode, setMode] = useState<ViewMode>("LIST");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleBackToList = () => {
    setSelectedId(null);
    setMode("LIST");
  };

  const handleSaved = (id: string) => {
    setSelectedId(id);
    setMode("DETAIL");
  };

  return (
    <div className="p-4 sm:p-6 mx-auto">
      {mode === "LIST" && (
        <NotificationManagementView
          role={actorRole}
          onNewCampaign={() => {
            setSelectedId(null);
            setMode("CREATE");
          }}
          onEditCampaign={(id) => {
            setSelectedId(id);
            setMode("EDIT");
          }}
          onViewCampaign={(id) => {
            setSelectedId(id);
            setMode("DETAIL");
          }}
        />
      )}

      {(mode === "CREATE" || mode === "EDIT") && (
        <NotificationCampaignFormView
          role={actorRole}
          campaignId={selectedId}
          onBack={handleBackToList}
          onSaved={handleSaved}
        />
      )}

      {mode === "DETAIL" && selectedId && (
        <NotificationCampaignDetailView
          campaignId={selectedId}
          onBack={handleBackToList}
          onEdit={(id) => {
            setSelectedId(id);
            setMode("EDIT");
          }}
        />
      )}
    </div>
  );
}
