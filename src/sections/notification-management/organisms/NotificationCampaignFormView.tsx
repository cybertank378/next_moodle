// Files: src/sections/notification-management/organisms/NotificationCampaignFormView.tsx
"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save, Send, Calendar, Eye } from "lucide-react";
import Button from "@/shared-ui/component/Button";
import NotificationContentForm from "@/sections/notification-management/molecules/NotificationContentForm";
import NotificationAudiencePanel from "@/sections/notification-management/molecules/NotificationAudiencePanel";
import NotificationSchedulePanel from "@/sections/notification-management/molecules/NotificationSchedulePanel";
import NotificationPreviewPanel from "@/sections/notification-management/molecules/NotificationPreviewPanel";
import { useNotificationManagementApi } from "@/modules/notification/presentation/hooks/useNotificationManagementApi";
import {
  NotificationAudienceScope,
  type NotificationAudienceSpec,
  NotificationChannel,
} from "@/modules/notification/domain/types/NotificationTypes";

interface Props {
  role: "ADMIN" | "TENANT";
  campaignId?: string | null;
  onBack: () => void;
  onSaved: (id: string) => void;
}

export default function NotificationCampaignFormView({
  role,
  campaignId,
  onBack,
  onSaved,
}: Props) {
  const {
    createCampaign,
    updateCampaign,
    fetchCampaign,
    previewAudience,
    sendCampaign,
    scheduleCampaign,
    loading,
  } = useNotificationManagementApi();

  const [title, setTitle] = useState("");
  const [contentJson, setContentJson] = useState<Record<string, unknown>>({
    type: "doc",
    content: [],
  });
  const [plainText, setPlainText] = useState("");
  const [pushSummary, setPushSummary] = useState("");
  const [channels, setChannels] = useState<NotificationChannel[]>([
    NotificationChannel.IN_APP,
    NotificationChannel.PUSH,
  ]);
  const [audience, setAudience] = useState<NotificationAudienceSpec>({
    scope: NotificationAudienceScope.ALL,
  });
  const [scheduledAt, setScheduledAt] = useState("");

  const [activeTab, setActiveTab] = useState<"FORM" | "PREVIEW">("FORM");
  const [estimatedCount, setEstimatedCount] = useState<number | undefined>();
  const [countingAudience, setCountingAudience] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Load existing campaign if editing
  useEffect(() => {
    if (!campaignId) return;
    fetchCampaign(campaignId).then((c) => {
      setTitle(c.title);
      setContentJson(c.contentJson || {});
      setPlainText(c.plainText || "");
      setPushSummary(c.pushSummary || "");
      setChannels(c.channels);
      setAudience(c.audienceSpec);
      if (c.scheduledAt) {
        setScheduledAt(c.scheduledAt.slice(0, 16));
      }
    });
  }, [campaignId, fetchCampaign]);

  const handlePreviewAudience = async () => {
    setCountingAudience(true);
    try {
      const res = await previewAudience(audience);
      setEstimatedCount(res.estimatedCount);
    } catch {
      // Ignored
    } finally {
      setCountingAudience(false);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = "Judul pengumuman wajib diisi.";
    }
    if (!plainText.trim() && (!contentJson.content || (contentJson.content as any[]).length === 0)) {
      errs.content = "Isi pengumuman wajib diisi.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (campaignId) {
        await updateCampaign(campaignId, {
          title,
          contentJson,
          pushSummary: pushSummary || undefined,
          channels,
          audienceSpec: audience,
        });
        onSaved(campaignId);
      } else {
        const created = await createCampaign({
          title,
          contentJson,
          pushSummary: pushSummary || undefined,
          channels,
          audienceSpec: audience,
        });
        onSaved(created.id);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOrSchedule = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      let currentId = campaignId;
      if (!currentId) {
        const created = await createCampaign({
          title,
          contentJson,
          pushSummary: pushSummary || undefined,
          channels,
          audienceSpec: audience,
        });
        currentId = created.id;
      } else {
        await updateCampaign(currentId, {
          title,
          contentJson,
          pushSummary: pushSummary || undefined,
          channels,
          audienceSpec: audience,
        });
      }

      if (scheduledAt) {
        await scheduleCampaign(currentId, new Date(scheduledAt).toISOString());
      } else {
        await sendCampaign(currentId);
      }
      onSaved(currentId);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {campaignId ? "Ubah Pengumuman" : "Buat Pengumuman Baru"}
            </h1>
            <p className="text-xs text-slate-500">
              Atur konten, target audiens, dan saluran pengiriman.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab view toggle */}
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-100">
            <button
              type="button"
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeTab === "FORM" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
              }`}
              onClick={() => setActiveTab("FORM")}
            >
              Formulir
            </button>
            <button
              type="button"
              className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors ${
                activeTab === "PREVIEW" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
              }`}
              onClick={() => setActiveTab("PREVIEW")}
            >
              <Eye className="w-3.5 h-3.5" />
              Pratinjau
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={submitting || loading}
            className="flex items-center gap-1.5 text-xs"
          >
            <Save className="w-4 h-4" />
            Simpan Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSendOrSchedule}
            disabled={submitting || loading}
            className="flex items-center gap-1.5 text-xs"
          >
            {scheduledAt ? (
              <>
                <Calendar className="w-4 h-4" />
                Jadwalkan Pengiriman
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Kirim Sekarang
              </>
            )}
          </Button>
        </div>
      </div>

      {activeTab === "FORM" ? (
        <div className="space-y-6">
          <NotificationContentForm
            title={title}
            onTitleChange={setTitle}
            contentJson={contentJson}
            onContentChange={({ json, text }) => {
              setContentJson(json);
              setPlainText(text);
            }}
            pushSummary={pushSummary}
            onPushSummaryChange={setPushSummary}
            channels={channels}
            onChannelsChange={setChannels}
            errors={errors}
            disabled={submitting}
          />

          <NotificationAudiencePanel
            role={role}
            audience={audience}
            onChange={setAudience}
            onPreviewAudience={handlePreviewAudience}
            estimatedCount={estimatedCount}
            loadingCount={countingAudience}
            disabled={submitting}
          />

          <NotificationSchedulePanel
            scheduledAt={scheduledAt}
            onChange={setScheduledAt}
            disabled={submitting}
          />
        </div>
      ) : (
        <NotificationPreviewPanel
          title={title}
          contentJson={contentJson}
          plainText={plainText}
          pushSummary={pushSummary}
          channels={channels}
        />
      )}
    </div>
  );
}
