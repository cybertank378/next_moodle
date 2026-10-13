"use client";

import type { FC } from "react";
import type { CalendarEventType } from "@/modules/calendar/domain/types/CalendarEventTypes";
import Checkbox from "@/shared-ui/component/Checkbox";
import SearchField from "@/shared-ui/component/SearchField";

interface CalendarFilterToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedTypes: CalendarEventType[];
  onToggleType: (type: CalendarEventType) => void;
  viewMode: "month" | "agenda";
  onViewModeChange: (mode: "month" | "agenda") => void;
}

export const CalendarFilterToolbar: FC<CalendarFilterToolbarProps> = ({
  search,
  onSearchChange,
  selectedTypes,
  onToggleType,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
      <div className="w-full md:w-72">
        <SearchField
          value={search}
          onChange={onSearchChange}
          placeholder="Cari agenda ujian/kegiatan..."
          size="sm"
        />
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Checkbox
            label="Ujian & Kuis"
            checked={selectedTypes.includes("QUIZ_EXAM")}
            onChange={() => onToggleType("QUIZ_EXAM")}
          />
        </div>

        <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => onViewModeChange("month")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === "month"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bulan
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("agenda")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === "agenda"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Agenda
          </button>
        </div>
      </div>
    </div>
  );
};
