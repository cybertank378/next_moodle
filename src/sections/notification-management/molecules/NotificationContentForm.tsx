// Files: src/sections/notification-management/molecules/NotificationContentForm.tsx
"use client";

import { Bell, Edit3 } from "lucide-react";
import BrandLogo from "@/shared-ui/component/BrandLogo";
import RichTextEditorField from "@/shared-ui/component/RichTextEditor/RichTextEditorField";
import TextField from "@/shared-ui/component/TextField";

interface Props {
  title: string;
  onTitleChange: (val: string) => void;
  contentJson: Record<string, unknown>;
  onContentChange: (val: {
    json: Record<string, unknown>;
    text: string;
    html: string;
  }) => void;
  pushSummary: string;
  onPushSummaryChange: (val: string) => void;
  isPushEnabled: boolean;
  plainText: string;
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
  isPushEnabled,
  plainText,
  errors,
  disabled = false,
}: Props) {
  const maxTitleLength = 150;
  const maxPushLength = 200;

  const effectivePushText =
    pushSummary.trim() ||
    plainText.trim() ||
    "Jadwal ujian tersedia. Silakan periksa akun Anda.";
  const charCount = plainText.length;

  return (
    <div className="space-y-6 bg-white p-5 sm:p-6 border border-slate-200/80 rounded-2xl shadow-xs">
      {/* Header with edit icon */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0">
          <Edit3 className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Konten Pengumuman
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pesan yang akan ditampilkan di inbox penerima.
          </p>
        </div>
      </div>

      {/* Judul Pengumuman */}
      <div className="space-y-1.5">
        <label
          htmlFor="campaign-title"
          className="text-xs font-semibold text-slate-700 block"
        >
          Judul Pengumuman
        </label>
        <TextField
          id="campaign-title"
          placeholder="Informasi Jadwal Ujian Tengah Semester"
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= maxTitleLength) {
              onTitleChange(e.target.value);
            }
          }}
          error={errors?.title}
          disabled={disabled}
        />
      </div>

      {/* Isi Pengumuman with RichTextEditor */}
      <div className="space-y-1.5">
        <label
          htmlFor="campaign-content"
          className="text-xs font-semibold text-slate-700 block"
        >
          Isi Pengumuman
        </label>
        <RichTextEditorField
          id="campaign-content"
          value={contentJson}
          onChange={onContentChange}
          error={errors?.content}
          disabled={disabled}
          minHeight="280px"
        />
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            Gunakan toolbar untuk memformat teks (judul, daftar, kutipan, dan
            tautan).
          </span>
          <span className="font-medium">{charCount} karakter</span>
        </div>
      </div>

      {/* Ringkasan Push */}
      {isPushEnabled && (
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="space-y-1.5">
            <label
              htmlFor="campaign-push-summary"
              className="text-xs font-semibold text-slate-700 block"
            >
              Ringkasan Push
            </label>
            <TextField
              id="campaign-push-summary"
              placeholder="Jadwal ujian tersedia. Silakan periksa akun Anda."
              value={pushSummary}
              onChange={(e) => {
                if (e.target.value.length <= maxPushLength) {
                  onPushSummaryChange(e.target.value);
                }
              }}
              helperText="Teks singkat yang tampil pada notifikasi perangkat."
              disabled={disabled}
            />
          </div>

          {/* Compact Push Preview */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Bell className="w-3.5 h-3.5 text-blue-600" />
              <span>Pratinjau Push</span>
            </div>

            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 overflow-hidden shadow-xs">
                <BrandLogo
                  className="h-7 w-7"
                  decorative
                  surfaceTone="dark"
                  variant="mark"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 text-sm truncate">
                  {title || "Informasi Jadwal Ujian Tengah Semester"}
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5">
                  {effectivePushText}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
