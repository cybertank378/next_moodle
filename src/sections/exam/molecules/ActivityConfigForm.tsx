"use client";

import { AlertCircle, Clock, FileText, Info } from "lucide-react";
import React from "react";
import type { ActivityType } from "@/sections/exam/molecules/ActivityTypeSelector";

export interface ActivityFormData {
  targetQuizId?: number;
  title: string;
  description: string;
  timeLimitMinutes?: number;
  passingGrade?: number;
  topicSection?: number;
  contentBody?: string;
  dueDate?: string;
  maxGrade?: number;
  submissionType?: "file" | "online_text";
}

interface TargetQuizOption {
  id: number;
  name: string;
}

interface ActivityConfigFormProps {
  activityType: ActivityType;
  formData: ActivityFormData;
  targetQuizzes: TargetQuizOption[];
  onChange: (field: keyof ActivityFormData, value: any) => void;
  disabled?: boolean;
}

export default function ActivityConfigForm({
  activityType,
  formData,
  targetQuizzes,
  onChange,
  disabled = false,
}: ActivityConfigFormProps) {
  return (
    <div className="space-y-4">
      {/* Quiz Specific Header & Target Selector */}
      {activityType === "quiz" && (
        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
            <div className="text-xs text-indigo-900 leading-relaxed">
              <span className="font-bold">Integrasi Bank Soal Moodle:</span> Butir
              soal yang dipilih di bawah akan langsung ditautkan ke kuis
              melalui API resmi <code className="px-1.5 py-0.5 bg-white rounded border border-indigo-200 font-mono text-[11px]">local_examapi_add_question_to_quiz</code>.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Pilih Kuis Tujuan di Mata Pelajaran Ini <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.targetQuizId ?? ""}
              onChange={(e) =>
                onChange(
                  "targetQuizId",
                  e.target.value ? parseInt(e.target.value, 10) : undefined,
                )
              }
              disabled={disabled}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            >
              <option value="">-- Pilih Kuis Aktif pada Course --</option>
              {targetQuizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name} (ID: {q.id})
                </option>
              ))}
            </select>
            {targetQuizzes.length === 0 && (
              <p className="text-[11px] text-amber-700 mt-1">
                Belum ada kuis yang terdaftar di mata pelajaran ini. Pastikan modul kuis sudah dibuat di course Moodle.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Materi Specific Alert */}
      {activityType === "materi" && (
        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-start gap-2.5">
          <FileText className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
          <div className="text-xs text-emerald-900 leading-relaxed">
            <span className="font-bold">Materi Pembelajaran:</span> Anda dapat
            menyusun ringkasan, panduan teks terstruktur, dan referensi bacaan
            untuk siswa. Konten materi ini akan disimpan dalam catatan kurikulum course.
          </div>
        </div>
      )}

      {/* Tugas Specific Alert */}
      {activityType === "tugas" && (
        <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">Penugasan Mandiri:</span> Tentukan batas
            waktu pengumpulan dan instruksi detail. Pengumpulan tugas oleh siswa
            disinkronisasikan sesuai status kontrak backend modul tugas.
          </div>
        </div>
      )}

      {/* Common Fields: Title & Description */}
      <div className="grid grid-cols-1 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-900 mb-1.5">
            Judul Aktivitas <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder={
              activityType === "quiz"
                ? "Contoh: Penilaian Harian Bab 1 - Aljabar Linier"
                : activityType === "materi"
                  ? "Contoh: Modul 1: Konsep Dasar dan Teori Bilangan"
                  : "Contoh: Tugas Individu: Analisis Studi Kasus Bab 2"
            }
            disabled={disabled}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-900 mb-1.5">
            Petunjuk & Deskripsi Pengerjaan
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Tuliskan petunjuk atau catatan penting bagi siswa sebelum memulai..."
            disabled={disabled}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-y"
          />
        </div>
      </div>

      {/* Activity Specific Extra Fields */}
      {activityType === "quiz" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Durasi Ujian (Menit)
              </span>
            </label>
            <input
              type="number"
              min={0}
              step={5}
              value={formData.timeLimitMinutes ?? 60}
              onChange={(e) =>
                onChange("timeLimitMinutes", parseInt(e.target.value, 10) || 0)
              }
              disabled={disabled}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Gunakan 0 jika tidak ada batasan waktu pengerjaan.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Nilai Kelulusan Minimal (KKM / Passing Grade)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={formData.passingGrade ?? 75}
              onChange={(e) =>
                onChange("passingGrade", parseFloat(e.target.value) || 0)
              }
              disabled={disabled}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Standar nilai KKM kelulusan ujian (skala 0 - 100).
            </p>
          </div>
        </div>
      )}

      {activityType === "materi" && (
        <div className="space-y-3.5 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Isi Konten Materi Pembelajaran <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={6}
              value={formData.contentBody ?? ""}
              onChange={(e) => onChange("contentBody", e.target.value)}
              placeholder="Tuliskan rangkuman materi pembelajaran, rumus penting, atau tautan video/dokumen referensi..."
              disabled={disabled}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-y font-mono"
            />
          </div>
        </div>
      )}

      {activityType === "tugas" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Batas Waktu Pengumpulan (Due Date)
            </label>
            <input
              type="datetime-local"
              value={formData.dueDate ?? ""}
              onChange={(e) => onChange("dueDate", e.target.value)}
              disabled={disabled}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Skor Maksimum Tugas
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={formData.maxGrade ?? 100}
              onChange={(e) =>
                onChange("maxGrade", parseInt(e.target.value, 10) || 100)
              }
              disabled={disabled}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
