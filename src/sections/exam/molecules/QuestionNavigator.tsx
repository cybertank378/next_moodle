"use client";

import { Flag, LayoutGrid } from "lucide-react";
import Button from "@/shared-ui/component/Button";

export interface QuestionNavigatorItem {
  slot: number;
  isAnswered: boolean;
  isFlagged?: boolean;
}

export interface QuestionNavigatorProps {
  questions: QuestionNavigatorItem[];
  currentSlot: number;
  onSelectSlot: (slot: number) => void;
  className?: string;
}

export default function QuestionNavigator({
  questions,
  currentSlot,
  onSelectSlot,
  className = "",
}: QuestionNavigatorProps) {
  const answeredCount = questions.filter((q) => q.isAnswered).length;
  const totalCount = questions.length;

  return (
    <div
      data-testid="question-navigator"
      className={`rounded-xl border border-slate-200  bg-white  p-5 shadow-sm space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-200  pb-3">
        <div className="flex items-center gap-2 text-slate-900  font-semibold text-sm">
          <LayoutGrid size={16} className="text-indigo-600 " />
          <span>Navigasi Soal</span>
        </div>
        <span className="text-xs text-slate-500  font-medium">
          {answeredCount} / {totalCount} Terjawab
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-5">
        {questions.map((q) => {
          const isActive = q.slot === currentSlot;
          const isAnswered = q.isAnswered;
          const isFlagged = q.isFlagged;

          let variant: "filled" | "outline" = "outline";
          let color: "primary" | "success" | "secondary" = "secondary";

          if (isActive) {
            variant = "filled";
            color = "primary";
          } else if (isAnswered) {
            variant = "filled";
            color = "success";
          }

          return (
            <div key={q.slot} className="relative">
              <Button
                size="sm"
                variant={variant}
                color={color}
                fullWidth
                onClick={() => onSelectSlot(q.slot)}
                aria-label={`Pindah ke soal nomor ${q.slot}`}
                data-testid={`nav-slot-${q.slot}`}
                className={`!h-9 !min-w-0 !px-0 font-bold text-xs ${
                  isActive
                    ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-white "
                    : ""
                }`}
              >
                {q.slot}
              </Button>
              {isFlagged && (
                <span
                  data-testid={`nav-flag-${q.slot}`}
                  className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-slate-950 pointer-events-none"
                  title="Ditandai ragu-ragu"
                >
                  <Flag size={8} fill="currentColor" />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-200  pt-3 space-y-1.5 text-[11px] text-slate-500 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Sudah Dijawab</span>
          </div>
          <span className="font-semibold text-slate-700 ">{answeredCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full border border-slate-400  bg-transparent" />
            <span>Belum Dijawab</span>
          </div>
          <span className="font-semibold text-slate-700 ">
            {totalCount - answeredCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Ditandai / Ragu</span>
          </div>
          <span className="font-semibold text-slate-700 ">
            {questions.filter((q) => q.isFlagged).length}
          </span>
        </div>
      </div>
    </div>
  );
}
