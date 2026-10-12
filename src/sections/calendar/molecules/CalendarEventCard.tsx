"use client";

import { BookOpen, Calendar, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { FC } from "react";
import type { CalendarEventItemDTO } from "@/modules/calendar/domain/dto/CalendarResponseDTO";
import { CalendarEventBadge } from "@/sections/calendar/atoms/CalendarEventBadge";
import Button from "@/shared-ui/component/Button";

interface CalendarEventCardProps {
  event: CalendarEventItemDTO;
  onSelect?: (event: CalendarEventItemDTO) => void;
}

export const CalendarEventCard: FC<CalendarEventCardProps> = ({
  event,
  onSelect,
}) => {
  const startDate = new Date(event.startAt);
  const endDate = event.endAt ? new Date(event.endAt) : null;

  const dateFormatted = startDate.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeFormatted = event.allDay
    ? "Sepanjang hari"
    : `${startDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} ${
        endDate
          ? `- ${endDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`
          : ""
      }`;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(event)}
      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col gap-2 text-left w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-800 text-sm line-clamp-2">
          {event.title}
        </h3>
        <CalendarEventBadge type={event.sourceType} />
      </div>

      {event.courseName && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <BookOpen className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{event.courseName}</span>
        </div>
      )}

      <div className="flex flex-col gap-1 text-xs text-slate-500 mt-1">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span>{dateFormatted}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span>{timeFormatted}</span>
        </div>
      </div>

      {event.detailRoute && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
          <Link href={event.detailRoute} onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              color="primary"
              rightIcon={ExternalLink}
            >
              Lihat Detail
            </Button>
          </Link>
        </div>
      )}
    </button>
  );
};
