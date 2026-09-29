"use client";

import { FileQuestion, RefreshCw } from "lucide-react";
import Button from "@/shared-ui/component/Button";

export interface ResultsEmptyStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ResultsEmptyState({
  title = "Tidak ada data nilai",
  description = "Belum ada rekaman penilaian atau hasil ujian yang tersedia.",
  onRetry,
  className = "",
}: ResultsEmptyStateProps) {
  return (
    <div
      data-testid="results-empty-state"
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 dark:border-gray-800 bg-slate-100 dark:bg-gray-800/60 text-slate-500 dark:text-gray-400">
        <FileQuestion size={24} />
      </div>

      <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h4>
      <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-gray-400">
        {description}
      </p>

      {onRetry && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="outline"
            color="secondary"
            leftIcon={RefreshCw}
            onClick={onRetry}
            aria-label="Coba lagi muat data"
          >
            Muat Ulang
          </Button>
        </div>
      )}
    </div>
  );
}
