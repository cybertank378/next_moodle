"use client";

import {
  CheckSquare,
  Dices,
  FolderOpen,
  Plus,
  Search,
  Square,
} from "lucide-react";
import React from "react";
import type { QuestionCategory } from "@/modules/questions/domain/types/QuestionTypes";
import BankSoalQuestionRow from "@/sections/exam/molecules/BankSoalQuestionRow";
import Button from "@/shared-ui/component/Button";
import Skeleton from "@/shared-ui/component/Skeleton";

interface QuestionItem {
  id: number;
  categoryId: number;
  type: string;
  name: string;
  questionText?: string;
  defaultMark?: number;
}

interface BankSoalPickerProps {
  questions: QuestionItem[];
  categories: QuestionCategory[];
  selectedQuestionIds: number[];
  selectedCategoryId: number | undefined;
  selectedQType: string | undefined;
  searchQuery: string;
  loading: boolean;
  onCategoryChange: (categoryId: number | undefined) => void;
  onQTypeChange: (qtype: string | undefined) => void;
  onSearchChange: (query: string) => void;
  onToggleSelect: (id: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onOpenCreateQuestionModal: () => void;
  onOpenRandomModal: () => void;
  disabled?: boolean;
}

const QUESTION_TYPE_OPTIONS = [
  { value: "", label: "Semua Tipe Soal" },
  { value: "multichoice", label: "Pilihan Ganda" },
  { value: "truefalse", label: "Benar / Salah" },
  { value: "shortanswer", label: "Isian Singkat" },
  { value: "essay", label: "Esai / Uraian" },
  { value: "match", label: "Menjodohkan" },
  { value: "numerical", label: "Numerik" },
];

export default function BankSoalPicker({
  questions,
  categories,
  selectedQuestionIds,
  selectedCategoryId,
  selectedQType,
  searchQuery,
  loading,
  onCategoryChange,
  onQTypeChange,
  onSearchChange,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onOpenCreateQuestionModal,
  onOpenRandomModal,
  disabled = false,
}: BankSoalPickerProps) {
  const allSelected =
    questions.length > 0 &&
    questions.every((q) => selectedQuestionIds.includes(q.id));

  return (
    <div className="space-y-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900">
              Pilih Soal dari Bank Soal Moodle
            </h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              {selectedQuestionIds.length} Terpilih
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Pilih butir soal yang sudah ada atau tambahkan soal baru ke Bank Soal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            leftIcon={Dices}
            onClick={onOpenRandomModal}
            disabled={disabled}
            className="text-xs"
          >
            Acak Soal
          </Button>

          <Button
            type="button"
            size="sm"
            color="primary"
            leftIcon={Plus}
            onClick={onOpenCreateQuestionModal}
            disabled={disabled}
            className="text-xs shadow-xs"
          >
            Buat Soal Baru
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari teks atau judul soal..."
            disabled={disabled}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="sm:col-span-4 relative">
          <FolderOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedCategoryId ?? ""}
            onChange={(e) =>
              onCategoryChange(
                e.target.value ? parseInt(e.target.value, 10) : undefined,
              )
            }
            disabled={disabled}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 truncate"
          >
            <option value="">Semua Kategori Bank Soal</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.questionCount ? `(${c.questionCount})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedQType ?? ""}
            onChange={(e) => onQTypeChange(e.target.value || undefined)}
            disabled={disabled}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 truncate"
          >
            {QUESTION_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Select All Controls */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1 pt-1">
        <span className="text-[11px] text-slate-500">
          Menampilkan {questions.length} butir soal
        </span>
        <div className="flex items-center gap-2">
          {allSelected ? (
            <button
              type="button"
              onClick={onDeselectAll}
              disabled={disabled}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Square className="w-3.5 h-3.5" /> Batal Pilih Semua
            </button>
          ) : (
            <button
              type="button"
              onClick={onSelectAll}
              disabled={disabled || questions.length === 0}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5" /> Pilih Semua di Halaman Ini
            </button>
          )}
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {loading && (
          <div className="space-y-2 p-2">
            {[1, 2, 3].map((i) => (
              <div
                key={`sk-${i}`}
                className="p-3 bg-white rounded-xl border border-slate-200 space-y-2"
              >
                <Skeleton height={16} width="40%" />
                <Skeleton height={12} width="85%" />
              </div>
            ))}
          </div>
        )}

        {!loading && questions.length === 0 && (
          <div className="text-center py-8 px-4 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              Tidak ada soal ditemukan
            </p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto mb-3">
              Kategori atau filter saat ini belum memiliki butir soal di Bank Soal. Buat butir soal baru atau ubah filter pencarian.
            </p>
            <Button
              type="button"
              size="sm"
              color="primary"
              leftIcon={Plus}
              onClick={onOpenCreateQuestionModal}
              disabled={disabled}
            >
              Buat Soal Pertama
            </Button>
          </div>
        )}

        {!loading &&
          questions.map((q) => (
            <BankSoalQuestionRow
              key={q.id}
              question={q}
              isSelected={selectedQuestionIds.includes(q.id)}
              onToggle={onToggleSelect}
              disabled={disabled}
            />
          ))}
      </div>
    </div>
  );
}
