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
import { Modal } from "@/shared-ui/component/Modal";

interface ScheduleSessionDetailModalProps {
  session: ScheduleSessionItemDTO | null;
  open: boolean;
  onClose: () => void;
}

export const ScheduleSessionDetailModal: FC<
  ScheduleSessionDetailModalProps
> = ({ session, open, onClose }) => {
  if (!session) return null;

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
    <Modal
      open={open}
      onClose={onClose}
      title={session.title}
      subtitle={session.courseName || "Detail Sesi Jadwal"}
      size="md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <ScheduleTypeBadge type={session.sessionType} />
          <ScheduleStatusBadge status={session.status} />
        </div>

        {session.description && (
          <div className="p-3 rounded-lg bg-slate-50 text-slate-700 text-sm">
            {session.description}
          </div>
        )}

        <div className="flex flex-col gap-2.5 text-sm text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">Tanggal:</span>
            <span>{dateFormatted}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">Waktu:</span>
            <span>{timeFormatted}</span>
          </div>

          {session.courseName && (
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-700">
                Mata Pelajaran:
              </span>
              <span>{session.courseName}</span>
            </div>
          )}

          {session.room && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-700">Ruangan:</span>
              <span>{session.room}</span>
            </div>
          )}

          {session.instructor && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-700">Pengajar:</span>
              <span>{session.instructor}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" color="secondary" onClick={onClose}>
            Tutup
          </Button>
          {session.detailRoute && (
            <Link href={session.detailRoute}>
              <Button variant="filled" color="primary" rightIcon={ExternalLink}>
                Buka Halaman Ujian
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Modal>
  );
};
