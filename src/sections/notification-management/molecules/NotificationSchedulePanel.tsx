// Files: src/sections/notification-management/molecules/NotificationSchedulePanel.tsx
"use client";

import { Calendar, Clock } from "lucide-react";
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
  return (
    <div className="space-y-4 bg-white p-6 border border-slate-200 rounded-xl shadow-xs">
      <div>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          Jadwal Pengiriman (Opsional)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur waktu kapan pengumuman akan dikirim secara otomatis oleh sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <TextField
            id="schedule-datetime"
            type="datetime-local"
            label="Waktu Pengiriman Otomatis"
            value={scheduledAt}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            helperText="Biarkan kosong jika ingin mengirim pengumuman secara langsung sekarang."
          />
        </div>

        <div className="flex flex-col justify-center">
          <label className="text-xs font-semibold text-slate-700 mb-1">Zona Waktu</label>
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{timezone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
