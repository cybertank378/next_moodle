// Files: src/sections/notification-management/molecules/NotificationSummaryCards.tsx
"use client";

import { Calendar, FileText, Send } from "lucide-react";

interface Props {
  total: number;
  sent: number;
  scheduled: number;
  draft: number;
  loading?: boolean;
}

export default function NotificationSummaryCards({
  total,
  sent,
  scheduled,
  draft,
  loading = false,
}: Props) {
  const cards = [
    {
      id: "total",
      label: "Total Pengumuman",
      value: total,
      icon: FileText,
    },
    {
      id: "sent",
      label: "Terkirim",
      value: sent,
      icon: Send,
    },
    {
      id: "scheduled",
      label: "Terjadwal",
      value: scheduled,
      icon: Calendar,
    },
    {
      id: "draft",
      label: "Draft",
      value: draft,
      icon: FileText,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4 animate-pulse"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-24 bg-slate-200 rounded" />
              <div className="h-6 w-12 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const IconComponent = c.icon;
        return (
          <div
            key={c.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-colors flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0">
              <IconComponent className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 block">
                {c.label}
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">
                {c.value.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
