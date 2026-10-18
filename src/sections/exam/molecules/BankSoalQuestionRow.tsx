"use client";

import React from "react";
import type { QuestionType } from "@/modules/questions/domain/types/QuestionTypes";

interface BankSoalQuestionRowProps {
  question: {
    id: number;
    categoryId: number;
    type: QuestionType | string;
    name: string;
    questionText?: string;
    defaultMark?: number;
  };
  isSelected: boolean;
  onToggle: (id: number) => void;
  disabled?: boolean;
}

const TYPE_LABELS: Record<string, { label: string; badgeClass: string }> = {
  multichoice: {
    label: "Pilihan Ganda",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  truefalse: {
    label: "Benar / Salah",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
  shortanswer: {
    label: "Isian Singkat",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  essay: {
    label: "Esai / Uraian",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  match: {
    label: "Menjodohkan",
    badgeClass: "bg-teal-50 text-teal-700 border-teal-200",
  },
  numerical: {
    label: "Numerik",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
};

export default function BankSoalQuestionRow({
  question,
  isSelected,
  onToggle,
  disabled = false,
}: BankSoalQuestionRowProps) {
  const typeInfo = TYPE_LABELS[question.type] || {
    label: question.type,
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const cleanText = (question.questionText || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div
      onClick={() => {
        if (!disabled) onToggle(question.id);
      }}
      className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? "bg-indigo-50/40 border-indigo-400 shadow-xs ring-1 ring-indigo-400/30"
          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <div className="pt-0.5">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            if (!disabled) onToggle(question.id);
          }}
          disabled={disabled}
          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {question.name || `Soal #${question.id}`}
          </span>
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${typeInfo.badgeClass}`}
          >
            {typeInfo.label}
          </span>
          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            Bobot: {question.defaultMark ?? 1} poin
          </span>
        </div>

        {cleanText && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {cleanText}
          </p>
        )}
      </div>
    </div>
  );
}
