"use client";

import {
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";
import type { FC } from "react";
import type { ScheduleSessionItemDTO } from "@/modules/schedule/domain/dto/ScheduleResponseDTO";
import { ScheduleStatusBadge } from "@/sections/schedule/atoms/ScheduleStatusBadge";
import { ScheduleTypeBadge } from "@/sections/schedule/atoms/ScheduleTypeBadge";
import Button from "@/shared-ui/component/Button";

interface ScheduleSessionCardProps {
  session: ScheduleSessionItemDTO;
  onSelect?: (session: ScheduleSessionItemDTO) => void;
}

export const ScheduleSessionCard: FC<ScheduleSessionCardProps> = ({
  session,
  onSelect,
}) => {
  const startDate = new Date(session.startsAt);
  const endDate = new Date(session.endsAt);

  const dateFormatted = startDate.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeFormatted = session.allDay
    ? "Sepanjang hari"
    : `${startDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <div
      onClick={() => onSelect?.(session)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(session);
        }
      }}
      tabIndex={0}
      role="button"
      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col gap-2.5 text-left w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 text-sm line-clamp-2">
            {session.title}
          </span>
          {session.subjectCode && (
            <span className="text-xs text-indigo-600 font-medium">
              {session.subjectCode}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <ScheduleTypeBadge type={session.sessionType} />
          <ScheduleStatusBadge status={session.status} />
        </div>
      </div>

      {session.courseName && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <BookOpen className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{session.courseName}</span>
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
        {session.room && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>Ruang: {session.room}</span>
          </div>
        )}
        {session.instructor && (
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>Pengajar: {session.instructor}</span>
          </div>
        )}
      </div>

      {session.detailRoute && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
          <Link href={session.detailRoute} onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              color="primary"
              rightIcon={ExternalLink}
            >
              Buka Sesi Ujian
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
