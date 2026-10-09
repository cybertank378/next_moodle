// Files: src/sections/notification-management/molecules/NotificationSchedulePanel.tsx
"use client";

import { Clock } from "lucide-react";
import TextField from "@/shared-ui/component/TextField";

interface Props {
  scheduledAt: string;
  onChange: (val: string) => void;
  timezone?: string;
  disabled?: boolean;
}

export default function NotificationSchedulePanel({
  scheduledAt,
  onChange,
  timezone = "Asia/Jakarta (WIB)",
  disabled = false,
}: Props) {
  const isScheduled = Boolean(scheduledAt);

  const handleModeChange = (mode: "NOW" | "SCHEDULE") => {
    if (mode === "NOW") {
      onChange("");
    } else {
      const future = new Date(Date.now() + 60 * 60 * 1000);
      onChange(future.toISOString().slice(0, 16));
    }
  };

  return (
    <div className="space-y-4 bg-white p-5 sm:p-6 border border-slate-200/80 rounded-2xl shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Waktu Pengiriman
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tentukan waktu pengiriman pengumuman.
          </p>
        </div>
      </div>

      {/* Radio options */}
      <div className="flex flex-col gap-2.5">
        <label
          className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors ${
            !isScheduled
              ? "border-blue-200 bg-blue-50/30"
              : "border-slate-200 hover:bg-slate-50/60"
          }`}
        >
          <input
            type="radio"
            name="delivery-time-mode"
            className="mt-0.5 text-blue-600 focus:ring-blue-500"
            checked={!isScheduled}
            onChange={() => handleModeChange("NOW")}
            disabled={disabled}
          />
          <div>
            <div className="text-xs font-semibold text-slate-900">
              Kirim sekarang
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Pengiriman dimulai setelah Anda mengonfirmasi.
            </div>
          </div>
        </label>

        <label
          className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors ${
            isScheduled
              ? "border-blue-200 bg-blue-50/30"
              : "border-slate-200 hover:bg-slate-50/60"
          }`}
        >
          <input
            type="radio"
            name="delivery-time-mode"
            className="mt-0.5 text-blue-600 focus:ring-blue-500"
            checked={isScheduled}
            onChange={() => handleModeChange("SCHEDULE")}
            disabled={disabled}
          />
          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-900">
              Jadwalkan
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Pilih tanggal dan waktu untuk mengirim pengumuman.
            </div>
          </div>
        </label>
      </div>

      {/* Date & Time Input if Scheduled */}
      {isScheduled && (
        <div className="pt-2 space-y-3">
          <TextField
            id="schedule-datetime"
            type="datetime-local"
            label="Tanggal & Jam Pengiriman"
            value={scheduledAt}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            helperText={`Zona waktu: ${timezone}`}
          />
        </div>
      )}
    </div>
  );
}
