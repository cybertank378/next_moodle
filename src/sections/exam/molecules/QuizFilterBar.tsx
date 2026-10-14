"use client";

import SearchField from "@/shared-ui/component/SearchField";

export type QuizTabFilter = "ALL" | "UPCOMING" | "OPEN" | "CLOSED";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter?: QuizTabFilter;
  onStatusFilterChange?: (status: QuizTabFilter) => void;
}

const TABS: { label: string; value: QuizTabFilter }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Berlangsung", value: "OPEN" },
  { label: "Akan Datang", value: "UPCOMING" },
  { label: "Selesai / Ditutup", value: "CLOSED" },
];

export default function QuizFilterBar({
  search,
  onSearchChange,
  statusFilter = "ALL",
  onStatusFilterChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="w-full sm:max-w-xs">
        <SearchField
          placeholder="Cari ujian atau kuis..."
          value={search}
          onChange={onSearchChange}
          size="sm"
        />
      </div>

      {/* Tabs */}
      {onStatusFilterChange && (
        <div
          role="tablist"
          aria-label="Filter status ujian"
          className="inline-flex rounded-xl border border-slate-200 bg-slate-50/70 p-1 text-xs"
        >
          {TABS.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onStatusFilterChange(tab.value)}
                className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
