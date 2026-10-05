// Files: src/sections/notification-management/molecules/NotificationContentForm.tsx
"use client";

import TextField from "@/shared-ui/component/TextField";
import RichTextEditorField from "@/shared-ui/component/RichTextEditor/RichTextEditorField";
import { NotificationChannel } from "@/modules/notification/domain/types/NotificationTypes";
import { Inbox, Bell } from "lucide-react";

interface Props {
  title: string;
  onTitleChange: (val: string) => void;
  contentJson: Record<string, unknown>;
  onContentChange: (val: { json: Record<string, unknown>; text: string; html: string }) => void;
  pushSummary: string;
  onPushSummaryChange: (val: string) => void;
  channels: NotificationChannel[];
  onChannelsChange: (channels: NotificationChannel[]) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

export default function NotificationContentForm({
  title,
  onTitleChange,
  contentJson,
  onContentChange,
  pushSummary,
  onPushSummaryChange,
  channels,
  onChannelsChange,
  errors,
  disabled = false,
}: Props) {
  const toggleChannel = (channel: NotificationChannel) => {
    if (channels.includes(channel)) {
      if (channels.length > 1) {
        onChannelsChange(channels.filter((c) => c !== channel));
      }
    } else {
      onChannelsChange([...channels, channel]);
    }
  };

  return (
    <div className="space-y-5 bg-white p-6 border border-slate-200 rounded-xl shadow-xs">
      <div>
        <h2 className="text-base font-bold text-slate-900">Konten Pengumuman</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Tulis judul dan isi pengumuman menggunakan rich text editor.
        </p>
      </div>

      <TextField
        id="campaign-title"
        label="Judul Pengumuman"
        required
        placeholder="Contoh: Jadwal Ujian Tengah Semester Ganjil"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        error={errors?.title}
        disabled={disabled}
      />

      <RichTextEditorField
        id="campaign-content"
        label="Isi Pengumuman"
        required
        value={contentJson}
        onChange={onContentChange}
        error={errors?.content}
        disabled={disabled}
        minHeight="220px"
      />

      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-2">
          Saluran Pengiriman
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              checked={channels.includes(NotificationChannel.IN_APP)}
              onChange={() => toggleChannel(NotificationChannel.IN_APP)}
              disabled={disabled}
            />
            <span className="flex items-center gap-1.5">
              <Inbox className="w-4 h-4 text-slate-500" />
              Inbox Aplikasi (In-App)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              checked={channels.includes(NotificationChannel.PUSH)}
              onChange={() => toggleChannel(NotificationChannel.PUSH)}
              disabled={disabled}
            />
            <span className="flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-indigo-600" />
              Push Notifikasi (FCM Perangkat)
            </span>
          </label>
        </div>
      </div>

      {channels.includes(NotificationChannel.PUSH) && (
        <TextField
          id="campaign-push-summary"
          label="Ringkasan Push Notifikasi (Opsional)"
          placeholder="Ringkasan singkat teks yang tampil di layar kunci perangkat..."
          value={pushSummary}
          onChange={(e) => onPushSummaryChange(e.target.value)}
          helperText="Maksimal 200 karakter. Jika kosong, diambil dari awal isi pengumuman."
          disabled={disabled}
        />
      )}
    </div>
  );
}
