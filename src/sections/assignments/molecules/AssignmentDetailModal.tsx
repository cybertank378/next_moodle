"use client";

import { AlertCircle, Clock } from "lucide-react";
import type { AssignmentItemDTO } from "@/modules/assignment/domain/dto/AssignmentResponseDTO";
import { AssignmentStatusBadge } from "@/sections/assignments/atoms/AssignmentStatusBadge";
import Button from "@/shared-ui/component/Button";
import { Modal } from "@/shared-ui/component/Modal";

interface AssignmentDetailModalProps {
  assignment: AssignmentItemDTO | null;
  open: boolean;
  onClose: () => void;
}

export function AssignmentDetailModal({
  assignment,
  open,
  onClose,
}: AssignmentDetailModalProps) {
  if (!assignment) return null;

  const formattedDueDate = assignment.dueDate
    ? new Date(assignment.dueDate * 1000).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Tidak ada batas waktu";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={assignment.name}
      subtitle={assignment.courseName || "Penugasan Pembelajaran"}
      size="lg"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Status:</span>
            <AssignmentStatusBadge
              status={assignment.status}
              isOverdue={assignment.isOverdue}
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Tenggat: {formattedDueDate}</span>
          </div>
        </div>

        {assignment.intro && (
          <div className="flex flex-col gap-1.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Instruksi Penugasan
            </h4>
            <div className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 whitespace-pre-wrap">
              {assignment.intro}
            </div>
          </div>
        )}

        {/* Backend Contract Blocked Notice for Submissions */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-amber-900">
              Pengiriman Tugas Belum Didukung oleh Backend Moodle
            </span>
            <p className="text-xs text-amber-700 leading-relaxed">
              Layanan Moodle API (plugin local_examapi) untuk modul penugasan
              (mod_assign) saat ini belum terdaftar pada kontrak Web Service
              resmi. Pengunggahan file dan penyimpanan teks jawaban ditangguhkan
              demi menjaga integritas data akademik.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="outline" color="secondary" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}
