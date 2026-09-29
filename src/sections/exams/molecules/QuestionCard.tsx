"use client";

import { Flag } from "lucide-react";
import { stripHtml } from "@/libs/utils";
import Button from "@/shared-ui/component/Button";

export interface QuestionCardData {
  slot: number;
  type?: string;
  html?: string;
  number?: number;
  maxMark?: number;
}

export interface QuestionCardProps {
  question: QuestionCardData;
  currentAnswer?: string;
  onAnswerChange: (value: string) => void;
  isFlagged?: boolean;
  onToggleFlag?: () => void;
  className?: string;
}

export default function QuestionCard({
  question,
  currentAnswer = "",
  onAnswerChange,
  isFlagged = false,
  onToggleFlag,
  className = "",
}: QuestionCardProps) {
  // Common multiple-choice options A, B, C, D, E for seamless assessment interaction
  const defaultOptions = [
    { label: "A", value: "1" },
    { label: "B", value: "2" },
    { label: "C", value: "3" },
    { label: "D", value: "4" },
    { label: "E", value: "5" },
  ];

  return (
    <div
      data-testid="question-card"
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151521] p-6 shadow-sm space-y-6 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-bold text-sm">
            {question.number ?? question.slot}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Soal Nomor {question.number ?? question.slot}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {question.maxMark
                ? `Bobot: ${question.maxMark} Poin`
                : "Pilihan Ganda"}
            </p>
          </div>
        </div>

        {onToggleFlag && (
          <Button
            size="sm"
            variant={isFlagged ? "filled" : "outline"}
            color={isFlagged ? "warning" : "secondary"}
            leftIcon={Flag}
            onClick={onToggleFlag}
            aria-label="Tandai ragu-ragu"
          >
            {isFlagged ? "Ditandai Ragu" : "Tandai Soal"}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {question.html ? (
          <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            {stripHtml(question.html)}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/40 p-4 text-sm text-slate-600 dark:text-slate-300">
            Pertanyaan nomor {question.slot} sedang dimuat. Pilih opsi jawaban
            Anda di bawah.
          </div>
        )}
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Pilihan Jawaban
        </h4>
        <div className="space-y-2">
          {defaultOptions.map((opt) => {
            const isSelected = currentAnswer === opt.value;
            return (
              <label
                key={opt.value}
                data-testid={`option-${opt.value}`}
                className={`flex items-center gap-3.5 rounded-xl border p-3.5 cursor-pointer transition-all ${
                  isSelected
                    ? "border-indigo-500/50 bg-indigo-500/10 text-slate-900 dark:text-white shadow-sm ring-1 ring-indigo-500/30"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-900/70"
                }`}
              >
                <input
                  type="radio"
                  name={`question_${question.slot}`}
                  value={opt.value}
                  checked={isSelected}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  className="h-4 w-4 border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                />
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {opt.label}
                </span>
                <span className="text-sm font-medium">Pilihan {opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
