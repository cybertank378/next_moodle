// Files: src/sections/notification-management/organisms/NotificationCampaignFormView.tsx
"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Eye,
  FileText,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  NotificationAudienceScope,
  type NotificationAudienceSpec,
  NotificationChannel,
} from "@/modules/notification/domain/types/NotificationTypes";
import { useNotificationManagementApi } from "@/modules/notification/presentation/hooks/useNotificationManagementApi";
import NotificationAudiencePanel from "@/sections/notification-management/molecules/NotificationAudiencePanel";
import NotificationChannelPanel from "@/sections/notification-management/molecules/NotificationChannelPanel";
import NotificationContentForm from "@/sections/notification-management/molecules/NotificationContentForm";
import NotificationPreviewPanel from "@/sections/notification-management/molecules/NotificationPreviewPanel";
import NotificationSchedulePanel from "@/sections/notification-management/molecules/NotificationSchedulePanel";
import Button from "@/shared-ui/component/Button";
import { Modal } from "@/shared-ui/component/Modal";

interface Props {
  role: "ADMIN" | "TENANT";
  campaignId?: string | null;
  onBack: () => void;
  onSaved: (id: string) => void;
}

const DEFAULT_FORM_CONTENT_JSON: Record<string, unknown> = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Persiapan Ujian Tengah Semester" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Bapak/Ibu guru dan siswa, silakan memeriksa jadwal ujian melalui akun masing-masing.",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Pastikan akun dapat digunakan." },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Periksa mata pelajaran dan waktu ujian.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Hubungi administrator sekolah jika membutuhkan bantuan.",
        },
      ],
    },
  ],
};

const DEFAULT_FORM_PLAIN_TEXT = `Persiapan Ujian Tengah Semester
Bapak/Ibu guru dan siswa, silakan memeriksa jadwal ujian melalui akun masing-masing.
• Pastikan akun dapat digunakan.
• Periksa mata pelajaran dan waktu ujian.
Hubungi administrator sekolah jika membutuhkan bantuan.`;

const DEFAULT_FORM_PUSH_SUMMARY =
  "Jadwal ujian tersedia. Silakan periksa akun Anda.";

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

  // Initialize with Mockup 2 reference values for new announcement
  const [title, setTitle] = useState(
    campaignId ? "" : "Informasi Jadwal Ujian Tengah Semester",
  );
  const [contentJson, setContentJson] = useState<Record<string, unknown>>(
    campaignId ? { type: "doc", content: [] } : DEFAULT_FORM_CONTENT_JSON,
  );
  const [plainText, setPlainText] = useState(
    campaignId ? "" : DEFAULT_FORM_PLAIN_TEXT,
  );
  const [pushSummary, setPushSummary] = useState(
    campaignId ? "" : DEFAULT_FORM_PUSH_SUMMARY,
  );
  const [channels, setChannels] = useState<NotificationChannel[]>([
    NotificationChannel.IN_APP,
    NotificationChannel.PUSH,
  ]);
  const [audience, setAudience] = useState<NotificationAudienceSpec>({
    scope: NotificationAudienceScope.TENANT,
    roles: ["STUDENT", "TEACHER"],
  });
  const [scheduledAt, setScheduledAt] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<string>(
    "SMP Hangtuah 2 Jakarta",
  );

  const [previewOpen, setPreviewOpen] = useState(false);
  const [estimatedCount, setEstimatedCount] = useState<number | undefined>();
  const [isStaleAudience, setIsStaleAudience] = useState(false);
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
      setIsStaleAudience(false);
    } catch {
      // Handled in hook
    } finally {
      setCountingAudience(false);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = "Judul pengumuman wajib diisi.";
    }
    const hasDocContent =
      Array.isArray(contentJson.content) && contentJson.content.length > 0;
    if (!plainText.trim() && !hasDocContent) {
      errs.content = "Isi pengumuman wajib diisi.";
    }
    if (channels.length === 0) {
      errs.channels = "Pilih minimal satu saluran pengiriman.";
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

  const handleOpenPreview = () => {
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Back button matching Mockup 2 */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-3">
          <span>{role === "ADMIN" ? "Admin" : "Tenant"}</span>
          <span>/</span>
          <span className="text-slate-600 font-semibold">
            Pengelolaan Notifikasi
          </span>
        </div>

        <Button
          type="button"
          variant="text"
          color="primary"
          size="sm"
          leftIcon={ArrowLeft}
          onClick={onBack}
          className="p-0 h-auto text-xs font-semibold mb-2"
        >
          Kembali
        </Button>

        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              PENGELOLAAN NOTIFIKASI
            </span>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {campaignId ? "Ubah Pengumuman" : "Buat Pengumuman"}
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200/80 text-slate-700">
                  ● Draft
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Draft disimpan secara manual
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Susun pesan dan tentukan penerima dengan mudah.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Button
              type="button"
              variant="outline"
              color="secondary"
              size="sm"
              leftIcon={Eye}
              onClick={handleOpenPreview}
              className="text-xs font-medium border-slate-200"
            >
              Pratinjau
            </Button>

            <Button
              type="button"
              variant="outline"
              color="secondary"
              size="sm"
              leftIcon={FileText}
              onClick={handleSaveDraft}
              loading={submitting || loading}
            >
              Simpan Draft
            </Button>

            <Button
              type="button"
              variant="filled"
              color="primary"
              size="sm"
              leftIcon={scheduledAt ? Calendar : Send}
              onClick={handleSendOrSchedule}
              loading={submitting || loading}
            >
              {scheduledAt ? "Jadwalkan" : "Kirim Sekarang"}
            </Button>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Workspace */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-6 space-y-6 lg:space-y-0 items-start">
        {/* Left Column (Konten Pengumuman): ~65% */}
        <div className="lg:col-span-7 xl:col-span-8 min-w-0">
          <NotificationContentForm
            title={title}
            onTitleChange={(val) => {
              setTitle(val);
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
            contentJson={contentJson}
            onContentChange={({ json, text }) => {
              setContentJson(json);
              setPlainText(text);
              setErrors((prev) => ({ ...prev, content: "" }));
            }}
            pushSummary={pushSummary}
            onPushSummaryChange={setPushSummary}
            isPushEnabled={channels.includes(NotificationChannel.PUSH)}
            plainText={plainText}
            errors={errors}
            disabled={submitting}
          />
        </div>

        {/* Right Column (Audiens, Saluran, Waktu, Alert): ~35% */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* Audiens Panel */}
          <NotificationAudiencePanel
            role={role}
            audience={audience}
            onChange={(spec) => {
              setAudience(spec);
              setIsStaleAudience(true);
            }}
            onPreviewAudience={handlePreviewAudience}
            selectedTenant={selectedTenant}
            onTenantChange={setSelectedTenant}
            estimatedCount={estimatedCount}
            isStaleCount={isStaleAudience}
            loadingCount={countingAudience}
            disabled={submitting}
          />

          {/* Saluran Pengiriman Panel */}
          <NotificationChannelPanel
            channels={channels}
            onChange={(chs) => {
              setChannels(chs);
              setErrors((prev) => ({ ...prev, channels: "" }));
            }}
            error={errors.channels}
            disabled={submitting}
          />

          {/* Waktu Pengiriman Panel */}
          <NotificationSchedulePanel
            scheduledAt={scheduledAt}
            onChange={setScheduledAt}
            disabled={submitting}
          />

          {/* Alert: Periksa sebelum mengirim */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                Periksa sebelum mengirim
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Pastikan isi pesan dan audiens sudah sesuai.
              </p>
            </div>
          </div>

          {/* Footer note matching Mockup 2 */}
          <div className="text-right text-[11px] text-slate-400 pt-1">
            Pratinjau desain • Konten ilustrasi.
          </div>
        </div>
      </div>

      {/* Pratinjau Modal */}
      <Modal
        open={previewOpen}
        onClose={handleClosePreview}
        title="Pratinjau Pengumuman"
        subtitle="Lihat bagaimana pengumuman ditampilkan di web portal dan ponsel."
        size="lg"
        cancelText="Tutup"
      >
        <div className="py-2">
          <NotificationPreviewPanel
            title={title}
            contentJson={contentJson}
            plainText={plainText}
            pushSummary={pushSummary}
            channels={channels}
          />
        </div>
      </Modal>
    </div>
  );
}
