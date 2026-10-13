"use client";

import { BookOpen, Calendar, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { FC } from "react";
import type { CalendarEventItemDTO } from "@/modules/calendar/domain/dto/CalendarResponseDTO";
import { CalendarEventBadge } from "@/sections/calendar/atoms/CalendarEventBadge";
import Button from "@/shared-ui/component/Button";
import { Modal } from "@/shared-ui/component/Modal";

interface CalendarEventDetailModalProps {
  event: CalendarEventItemDTO | null;
  open: boolean;
  onClose: () => void;
}

export const CalendarEventDetailModal: FC<CalendarEventDetailModalProps> = ({
  event,
  open,
  onClose,
}) => {
  if (!event) return null;

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
    <Modal open={open} onClose={onClose} title="Detail Agenda" size="md">
      <div className="flex flex-col gap-4 text-slate-700">
        <div className="flex items-center justify-between gap-2">
          <CalendarEventBadge type={event.sourceType} />
          {event.status && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              {event.status}
            </span>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">{event.title}</h2>
          {event.courseName && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>{event.courseName}</span>
            </div>
          )}
        </div>

        <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-2 text-sm border border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-medium">{dateFormatted}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{timeFormatted}</span>
          </div>
        </div>

        {event.description && (
          <div className="text-sm">
            <h4 className="font-semibold text-slate-900 mb-1">Keterangan:</h4>
            <p className="text-slate-600 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end gap-2">
          <Button variant="outline" color="secondary" onClick={onClose}>
            Tutup
          </Button>
          {event.detailRoute && (
            <Link href={event.detailRoute} onClick={onClose}>
              <Button color="primary" rightIcon={ExternalLink}>
                Buka Ujian / Modul
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Modal>
  );
};
