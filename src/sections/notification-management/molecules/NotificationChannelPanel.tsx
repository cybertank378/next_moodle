// Files: src/sections/notification-management/molecules/NotificationChannelPanel.tsx
"use client";

import { Bell, Mail, Send } from "lucide-react";
import { NotificationChannel } from "@/modules/notification/domain/types/NotificationTypes";

interface Props {
  channels: NotificationChannel[];
  onChange: (channels: NotificationChannel[]) => void;
  error?: string;
  disabled?: boolean;
}

export default function NotificationChannelPanel({
  channels,
  onChange,
  error,
  disabled = false,
}: Props) {
  const toggleChannel = (channel: NotificationChannel) => {
    if (channels.includes(channel)) {
      if (channels.length > 1) {
        onChange(channels.filter((c) => c !== channel));
      }
    } else {
      onChange([...channels, channel]);
    }
  };

  return (
    <div className="space-y-4 bg-white p-5 sm:p-6 border border-slate-200/80 rounded-2xl shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0">
          <Send className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Saluran Pengiriman
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih saluran yang digunakan untuk mengirim pengumuman.
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {/* Inbox Aplikasi */}
        <label
          className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors ${
            channels.includes(NotificationChannel.IN_APP)
              ? "border-blue-200 bg-blue-50/30"
              : "border-slate-200 hover:bg-slate-50/60"
          }`}
        >
          <input
            type="checkbox"
            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            checked={channels.includes(NotificationChannel.IN_APP)}
            onChange={() => toggleChannel(NotificationChannel.IN_APP)}
            disabled={disabled}
          />
          <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-900">
              Inbox Aplikasi
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Pesan tersimpan di aplikasi.
            </div>
          </div>
        </label>

        {/* Push Notifikasi */}
        <label
          className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors ${
            channels.includes(NotificationChannel.PUSH)
              ? "border-blue-200 bg-blue-50/30"
              : "border-slate-200 hover:bg-slate-50/60"
          }`}
        >
          <input
            type="checkbox"
            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            checked={channels.includes(NotificationChannel.PUSH)}
            onChange={() => toggleChannel(NotificationChannel.PUSH)}
            disabled={disabled}
          />
          <Bell className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-900">
              Push Notifikasi
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Untuk perangkat yang mengaktifkan izin.
            </div>
          </div>
        </label>
      </div>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
}
