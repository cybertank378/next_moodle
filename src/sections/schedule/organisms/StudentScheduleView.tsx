"use client";

import { AlertCircle, CalendarDays, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ScheduleSessionItemDTO } from "@/modules/schedule/domain/dto/ScheduleResponseDTO";
import type { ScheduleSessionType } from "@/modules/schedule/domain/types/ScheduleTypes";
import { useScheduleApi } from "@/modules/schedule/presentation/hooks/useScheduleApi";
import { ScheduleSessionCard } from "@/sections/schedule/molecules/ScheduleSessionCard";
import { ScheduleSessionDetailModal } from "@/sections/schedule/molecules/ScheduleSessionDetailModal";
import { ScheduleToolbar } from "@/sections/schedule/molecules/ScheduleToolbar";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import EmptyState from "@/shared-ui/component/EmptyState";
import Skeleton from "@/shared-ui/component/Skeleton";

export function StudentScheduleView() {
  const { data, loading, error, fetchSchedule } = useScheduleApi();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "agenda">("week");
  const [search, setSearch] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<ScheduleSessionType[]>([
    "EXAM",
    "LESSON",
    "CONSULTATION",
  ]);
  const [selectedSession, setSelectedSession] =
    useState<ScheduleSessionItemDTO | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Compute boundaries based on viewMode
  const dateRange = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();

    if (viewMode === "day") {
      const from = new Date(Date.UTC(year, month, date, 0, 0, 0));
      const to = new Date(Date.UTC(year, month, date, 23, 59, 59));
      return {
        from: from.toISOString().split("T")[0],
        to: to.toISOString().split("T")[0],
      };
    }

    if (viewMode === "week") {
      // Find Monday of the current week
      const day = currentDate.getDay(); // 0 is Sunday, 1 is Monday
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(currentDate);
      monday.setDate(currentDate.getDate() + diffToMonday);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const from = new Date(
        Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate()),
      );
      const to = new Date(
        Date.UTC(
          sunday.getFullYear(),
          sunday.getMonth(),
          sunday.getDate(),
          23,
          59,
          59,
        ),
      );
      return {
        from: from.toISOString().split("T")[0],
        to: to.toISOString().split("T")[0],
      };
    }

    // Agenda: 30 days window from 7 days ago
    const from = new Date(Date.UTC(year, month, date - 7));
    const to = new Date(Date.UTC(year, month, date + 23, 23, 59, 59));
    return {
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0],
    };
  }, [currentDate, viewMode]);

  useEffect(() => {
    fetchSchedule({
      from: dateRange.from,
      to: dateRange.to,
      types: selectedTypes,
    });
  }, [fetchSchedule, dateRange, selectedTypes]);

  // Label for toolbar
  const currentDateRangeLabel = useMemo(() => {
    if (viewMode === "day") {
      return currentDate.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    if (viewMode === "week") {
      const day = currentDate.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(currentDate);
      monday.setDate(currentDate.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const monStr = monday.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
      const sunStr = sunday.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return `${monStr} - ${sunStr}`;
    }

    return currentDate.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  }, [currentDate, viewMode]);

  const handlePrev = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (viewMode === "day") {
        next.setDate(prev.getDate() - 1);
      } else if (viewMode === "week") {
        next.setDate(prev.getDate() - 7);
      } else {
        next.setMonth(prev.getMonth() - 1);
      }
      return next;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (viewMode === "day") {
        next.setDate(prev.getDate() + 1);
      } else if (viewMode === "week") {
        next.setDate(prev.getDate() + 7);
      } else {
        next.setMonth(prev.getMonth() + 1);
      }
      return next;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleToggleType = (type: ScheduleSessionType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // Filter sessions by search term
  const filteredSessions = useMemo(() => {
    if (!data?.items) return [];
    let items = data.items;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.courseName?.toLowerCase().includes(q) ||
          s.subjectCode?.toLowerCase().includes(q) ||
          s.room?.toLowerCase().includes(q) ||
          s.instructor?.toLowerCase().includes(q),
      );
    }

    return items;
  }, [data, search]);

  // Week days list for week view
  const weekDays = useMemo(() => {
    const day = currentDate.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() + diffToMonday);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  // Sessions mapped by YYYY-MM-DD
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, ScheduleSessionItemDTO[]>();
    for (const s of filteredSessions) {
      const dateKey = s.startsAt.split("T")[0];
      const existing = map.get(dateKey) || [];
      existing.push(s);
      map.set(dateKey, existing);
    }
    return map;
  }, [filteredSessions]);

  const handleSelectSession = (s: ScheduleSessionItemDTO) => {
    setSelectedSession(s);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Jadwal Pelajaran
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Lihat jadwal kelas terdaftar, sesi ujian mendatang, dan agenda pembelajaran.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          color="secondary"
          leftIcon={RefreshCw}
          loading={loading}
          onClick={() =>
            fetchSchedule({
              from: dateRange.from,
              to: dateRange.to,
              types: selectedTypes,
            })
          }
        >
          Perbarui
        </Button>
      </div>

      {/* Toolbar */}
      <ScheduleToolbar
        currentDateRangeLabel={currentDateRangeLabel}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        search={search}
        onSearchChange={setSearch}
        selectedTypes={selectedTypes}
        onToggleType={handleToggleType}
      />

      {/* Error state */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <div className="flex-1 text-sm">{error}</div>
          <Button
            variant="outline"
            size="sm"
            color="danger"
            onClick={() =>
              fetchSchedule({
                from: dateRange.from,
                to: dateRange.to,
                types: selectedTypes,
              })
            }
          >
            Coba Lagi
          </Button>
        </Card>
      )}

      {/* Loading state */}
      {loading && !data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
      )}

      {/* Main Schedule Content */}
      {!loading && filteredSessions.length === 0 && (
        <EmptyState
          icon={<CalendarDays className="w-8 h-8 text-slate-400" />}
          title="Tidak Ada Jadwal"
          description={
            search
              ? "Tidak ada sesi jadwal yang sesuai dengan kata kunci pencarian Anda."
              : "Tidak ada jadwal kelas atau sesi ujian pada rentang waktu yang dipilih."
          }
        />
      )}

      {/* Week View */}
      {viewMode === "week" && filteredSessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const dateKey = day.toISOString().split("T")[0];
            const isToday =
              new Date().toISOString().split("T")[0] === dateKey;
            const daySessions = sessionsByDate.get(dateKey) || [];

            return (
              <div
                key={dateKey}
                className={`flex flex-col gap-2 rounded-xl border p-3 min-h-[180px] ${
                  isToday
                    ? "border-indigo-300 bg-indigo-50/20 shadow-sm"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span
                    className={`text-xs font-semibold uppercase ${
                      isToday ? "text-indigo-600" : "text-slate-500"
                    }`}
                  >
                    {day.toLocaleDateString("id-ID", { weekday: "short" })}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      isToday
                        ? "bg-indigo-600 text-white"
                        : "text-slate-700 bg-slate-100"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>

                {daySessions.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-xs text-slate-400 py-4">
                    Tidak ada sesi
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {daySessions.map((session) => (
                      <ScheduleSessionCard
                        key={session.id}
                        session={session}
                        onSelect={handleSelectSession}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Day / Agenda View */}
      {(viewMode === "day" || viewMode === "agenda") &&
        filteredSessions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map((session) => (
              <ScheduleSessionCard
                key={session.id}
                session={session}
                onSelect={handleSelectSession}
              />
            ))}
          </div>
        )}

      {/* Detail Modal */}
      <ScheduleSessionDetailModal
        session={selectedSession}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
