"use client";

import { useEffect, useMemo, useState } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AlertCircle, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import type { CalendarEventItemDTO } from "@/modules/calendar/domain/dto/CalendarResponseDTO";
import type { CalendarEventType } from "@/modules/calendar/domain/types/CalendarEventTypes";
import { useCalendarApi } from "@/modules/calendar/presentation/hooks/useCalendarApi";
import { CalendarDayDot } from "@/sections/calendar/atoms/CalendarDayDot";
import { CalendarEventCard } from "@/sections/calendar/molecules/CalendarEventCard";
import { CalendarEventDetailModal } from "@/sections/calendar/molecules/CalendarEventDetailModal";
import { CalendarFilterToolbar } from "@/sections/calendar/molecules/CalendarFilterToolbar";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import EmptyState from "@/shared-ui/component/EmptyState";
import Skeleton from "@/shared-ui/component/Skeleton";

export function StudentCalendarView() {
  const { data, loading, error, fetchEvents } = useCalendarApi();
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [search, setSearch] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<CalendarEventType[]>([
    "QUIZ_EXAM",
  ]);
  const [viewMode, setViewMode] = useState<"month" | "agenda">("month");
  const [selectedEvent, setSelectedEvent] =
    useState<CalendarEventItemDTO | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Calculate month boundaries for active view
  const currentMonthRange = useMemo(() => {
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();
    // Fetch padded by 7 days before and after to cover outside-month days in calendar grid
    const from = new Date(Date.UTC(year, month, 1 - 7));
    const to = new Date(Date.UTC(year, month + 1, 7, 23, 59, 59));
    return {
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0],
    };
  }, [activeDate]);

  useEffect(() => {
    fetchEvents({
      from: currentMonthRange.from,
      to: currentMonthRange.to,
      types: selectedTypes,
    });
  }, [fetchEvents, currentMonthRange, selectedTypes]);

  // Filter events by search term
  const filteredEvents = useMemo(() => {
    if (!data?.items) return [];
    let items = data.items;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (ev) =>
          ev.title.toLowerCase().includes(q) ||
          ev.courseName?.toLowerCase().includes(q) ||
          ev.description?.toLowerCase().includes(q),
      );
    }

    return items;
  }, [data, search]);

  // Events map by YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEventItemDTO[]>();
    for (const ev of filteredEvents) {
      const dateKey = ev.startAt.split("T")[0];
      const existing = map.get(dateKey) || [];
      existing.push(ev);
      map.set(dateKey, existing);
    }
    return map;
  }, [filteredEvents]);

  // Selected date key
  const selectedDateKey = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  const selectedDateEvents = useMemo(() => {
    return eventsByDate.get(selectedDateKey) || [];
  }, [eventsByDate, selectedDateKey]);

  const handleToggleType = (type: CalendarEventType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleOpenEventModal = (event: CalendarEventItemDTO) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kalender Akademik
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau jadwal ujian, tenggat modul, dan agenda pembelajaran Anda.
          </p>
        </div>

        <Button
          variant="outline"
          color="secondary"
          size="sm"
          leftIcon={RefreshCw}
          loading={loading}
          onClick={() =>
            fetchEvents({
              from: currentMonthRange.from,
              to: currentMonthRange.to,
              types: selectedTypes,
            })
          }
        >
          Muat Ulang
        </Button>
      </div>

      {/* Filter toolbar */}
      <CalendarFilterToolbar
        search={search}
        onSearchChange={setSearch}
        selectedTypes={selectedTypes}
        onToggleType={handleToggleType}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Error state banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <Button
            variant="outline"
            color="error"
            size="sm"
            onClick={() =>
              fetchEvents({
                from: currentMonthRange.from,
                to: currentMonthRange.to,
                types: selectedTypes,
              })
            }
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Main Content Area */}
      {loading && !data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-96 flex flex-col justify-center">
              <Skeleton count={5} height={40} gap={16} />
            </Card>
          </div>
          <div>
            <Card className="h-96 flex flex-col justify-center">
              <Skeleton count={4} height={50} gap={12} />
            </Card>
          </div>
        </div>
      ) : viewMode === "month" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* React Calendar Container */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden p-6 bg-white shadow-sm border border-slate-200">
              <div className="react-calendar-custom-wrapper">
                <ReactCalendar
                  value={selectedDate}
                  onChange={(val) => {
                    if (val instanceof Date) {
                      setSelectedDate(val);
                    }
                  }}
                  onActiveStartDateChange={({ activeStartDate }) => {
                    if (activeStartDate) {
                      setActiveDate(activeStartDate);
                    }
                  }}
                  locale="id-ID"
                  tileContent={({ date, view }) => {
                    if (view !== "month") return null;
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const key = `${year}-${month}-${day}`;
                    const evs = eventsByDate.get(key);
                    return <CalendarDayDot events={evs || []} />;
                  }}
                  className="w-full border-none rounded-xl font-sans"
                />
              </div>
            </Card>
          </div>

          {/* Side panel for selected date agenda */}
          <div>
            <Card className="p-6 bg-white border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {selectedDate.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
                  {selectedDateEvents.length} Agenda
                </span>
              </div>

              {selectedDateEvents.length === 0 ? (
                <EmptyState
                  title="Tidak ada agenda"
                  description="Tidak ada ujian atau kegiatan yang dijadwalkan pada tanggal ini."
                  className="py-10 border-none bg-slate-50/50"
                />
              ) : (
                <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {selectedDateEvents.map((ev) => (
                    <CalendarEventCard
                      key={ev.id}
                      event={ev}
                      onSelect={handleOpenEventModal}
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        /* Agenda view */
        <Card className="p-6 bg-white border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Daftar Agenda Bulan Ini
          </h2>
          {filteredEvents.length === 0 ? (
            <EmptyState
              title="Tidak ada agenda yang ditemukan"
              description="Tidak ada kegiatan atau ujian yang sesuai dengan kriteria filter saat ini."
              className="py-16"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((ev) => (
                <CalendarEventCard
                  key={ev.id}
                  event={ev}
                  onSelect={handleOpenEventModal}
                />
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Event Detail Modal */}
      <CalendarEventDetailModal
        event={selectedEvent}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
