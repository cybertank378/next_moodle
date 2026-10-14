"use client";

import type { FC } from "react";
import type { CalendarEventType } from "@/modules/calendar/domain/types/CalendarEventTypes";
import Checkbox from "@/shared-ui/component/Checkbox";
import SearchField from "@/shared-ui/component/SearchField";
import ToggleGroup from "@/shared-ui/component/ToggleGroup";

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

        <ToggleGroup
          value={viewMode}
          onChange={(val) => onViewModeChange(val as "month" | "agenda")}
          options={[
            { label: "Bulan", value: "month" },
            { label: "Agenda", value: "agenda" },
          ]}
        />
      </div>
    </div>
  );
};
