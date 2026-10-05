// Files: src/sections/notification-management/molecules/NotificationPreviewPanel.tsx
"use client";

import { Bell, Inbox, Smartphone } from "lucide-react";
import RichTextViewer from "@/shared-ui/component/RichTextEditor/RichTextViewer";

interface Props {
  title: string;
  contentJson: Record<string, unknown>;
  plainText: string;
  pushSummary?: string;
  channels: string[];
}

export default function NotificationPreviewPanel({
  title,
  contentJson,
  plainText,
  pushSummary,
  channels,
}: Props) {
  return (
    <div className="space-y-5">
      {/* In-App Inbox Preview */}
      {channels.includes("IN_APP") && (
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
            <Inbox className="w-4 h-4 text-slate-500" />
            Pratinjau Inbox Aplikasi
          </div>

          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">
              {title || "Judul Pengumuman"}
            </h3>
            {contentJson && Object.keys(contentJson).length > 0 ? (
              <RichTextViewer content={contentJson} />
            ) : (
              <p className="text-xs text-slate-500 italic">
                {plainText || "Isi pengumuman belum dibuat."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Push Notification Mobile Mockup */}
      {channels.includes("PUSH") && (
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            Pratinjau Notifikasi Push di Perangkat
          </div>

          <div className="max-w-sm mx-auto p-3.5 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Bell className="w-3.5 h-3.5 text-indigo-400" />
                Exam LMS
              </span>
              <span>Baru saja</span>
            </div>

            <div className="text-xs font-bold text-white mb-0.5">
              {title || "Judul Notifikasi"}
            </div>
            <div className="text-xs text-slate-300 line-clamp-2">
              {pushSummary || plainText || "Ringkasan teks notifikasi push..."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
