"use client";

import { BookOpen, CheckCircle2, ClipboardCheck, FileQuestion } from "lucide-react";
import React from "react";

export type ActivityType = "quiz" | "materi" | "tugas";

interface ActivityTypeSelectorProps {
  activeType: ActivityType;
  onChange: (type: ActivityType) => void;
  disabled?: boolean;
}

interface TypeOption {
  type: ActivityType;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const TYPE_OPTIONS: TypeOption[] = [
  {
    type: "quiz",
    title: "Kuis & Ujian",
    subtitle: "Evaluasi & Asesmen",
    description: "Ujian online berbasis Bank Soal Moodle dengan penilaian otomatis dan timer.",
    badge: "Bank Soal",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: FileQuestion,
    accentColor: "border-indigo-600 ring-indigo-500/20 bg-indigo-50/30",
  },
  {
    type: "materi",
    title: "Materi Belajar",
    subtitle: "Bahan Pembelajaran",
    description: "Modul, bacaan, atau panduan materi teks dan referensi untuk siswa.",
    badge: "Materi",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: BookOpen,
    accentColor: "border-emerald-600 ring-emerald-500/20 bg-emerald-50/30",
  },
  {
    type: "tugas",
    title: "Tugas Mandiri",
    subtitle: "Penugasan & Proyek",
    description: "Instruksi tugas dengan batas pengumpulan, rubrik, dan penilaian guru.",
    badge: "Tugas",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: ClipboardCheck,
    accentColor: "border-amber-600 ring-amber-500/20 bg-amber-50/30",
  },
];

export default function ActivityTypeSelector({
  activeType,
  onChange,
  disabled = false,
}: ActivityTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-900">
          Pilih Jenis Aktivitas Pembelajaran <span className="text-rose-500">*</span>
        </label>
        <span className="text-xs text-slate-500">
          Tentukan tipe aktivitas yang ingin dibuat di mata pelajaran ini
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TYPE_OPTIONS.map((opt) => {
          const isSelected = activeType === opt.type;
          const Icon = opt.icon;

          return (
            <button
              key={opt.type}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.type)}
              className={`relative flex flex-col text-left p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
                isSelected
                  ? `${opt.accentColor} shadow-sm ring-4`
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-white shadow-xs" : "bg-slate-100"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isSelected ? "text-slate-900" : "text-slate-500"
                    }`}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${opt.badgeColor}`}
                  >
                    {opt.badge}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                  )}
                </div>
              </div>

              <div className="mt-auto">
                <h4 className="text-sm font-bold text-slate-900">{opt.title}</h4>
                <p className="text-xs text-slate-500 mb-1">{opt.subtitle}</p>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
