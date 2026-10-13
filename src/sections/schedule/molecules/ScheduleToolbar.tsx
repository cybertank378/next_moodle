"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import type { FC } from "react";
import type { ScheduleSessionType } from "@/modules/schedule/domain/types/ScheduleTypes";
import Button from "@/shared-ui/component/Button";
import SearchField from "@/shared-ui/component/SearchField";

interface ScheduleToolbarProps {
  currentDateRangeLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  viewMode: "day" | "week" | "agenda";
  onViewModeChange: (mode: "day" | "week" | "agenda") => void;
  search: string;
  onSearchChange: (search: string) => void;
  selectedTypes: ScheduleSessionType[];
  onToggleType: (type: ScheduleSessionType) => void;
}

export const ScheduleToolbar: FC<ScheduleToolbarProps> = ({
  currentDateRangeLabel,
  onPrev,
  onNext,
  onToday,
  viewMode,
  onViewModeChange,
  search,
  onSearchChange,
  selectedTypes,
  onToggleType,
}) => {
  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Navigation & Range */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              iconOnly
              leftIcon={ChevronLeft}
              onClick={onPrev}
              aria-label="Sebelumnya"
            />
            <Button
              variant="outline"
              size="sm"
              iconOnly
              leftIcon={ChevronRight}
              onClick={onNext}
              aria-label="Berikutnya"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
          >
            Hari Ini
          </Button>

          <span className="text-sm font-semibold text-slate-800 ml-2">
            {currentDateRangeLabel}
          </span>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button
            variant={viewMode === "day" ? "filled" : "outline"}
            color={viewMode === "day" ? "primary" : "secondary"}
            size="sm"
            onClick={() => onViewModeChange("day")}
          >
            Hari
          </Button>
          <Button
            variant={viewMode === "week" ? "filled" : "outline"}
            color={viewMode === "week" ? "primary" : "secondary"}
            size="sm"
            onClick={() => onViewModeChange("week")}
          >
            Minggu
          </Button>
          <Button
            variant={viewMode === "agenda" ? "filled" : "outline"}
            color={viewMode === "agenda" ? "primary" : "secondary"}
            size="sm"
            onClick={() => onViewModeChange("agenda")}
          >
            Agenda
          </Button>
        </div>
      </div>

      {/* Filter and search row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="w-full sm:w-72">
          <SearchField
            value={search}
            onChange={onSearchChange}
            placeholder="Cari sesi atau mata pelajaran..."
            size="sm"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Tipe:</span>
          </div>

          <Button
            variant={selectedTypes.includes("EXAM") ? "filled" : "outline"}
            color={selectedTypes.includes("EXAM") ? "error" : "secondary"}
            size="sm"
            onClick={() => onToggleType("EXAM")}
          >
            Ujian / Kuis
          </Button>

          <Button
            variant={selectedTypes.includes("LESSON") ? "filled" : "outline"}
            color={selectedTypes.includes("LESSON") ? "primary" : "secondary"}
            size="sm"
            onClick={() => onToggleType("LESSON")}
          >
            Pelajaran
          </Button>

          <Button
            variant={selectedTypes.includes("CONSULTATION") ? "filled" : "outline"}
            color={selectedTypes.includes("CONSULTATION") ? "info" : "secondary"}
            size="sm"
            onClick={() => onToggleType("CONSULTATION")}
          >
            Konsultasi
          </Button>
        </div>
      </div>
    </div>
  );
};
