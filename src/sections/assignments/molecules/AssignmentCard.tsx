"use client";

import { Calendar, ChevronRight } from "lucide-react";
import type { AssignmentItemDTO } from "@/modules/assignment/domain/dto/AssignmentResponseDTO";
import { AssignmentStatusBadge } from "@/sections/assignments/atoms/AssignmentStatusBadge";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";

interface AssignmentCardProps {
  assignment: AssignmentItemDTO;
  onSelect: (assignment: AssignmentItemDTO) => void;
}

export function AssignmentCard({ assignment, onSelect }: AssignmentCardProps) {
  const formattedDueDate = assignment.dueDate
    ? new Date(assignment.dueDate * 1000).toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Tidak ada tenggat";

  return (
    <Card className="flex flex-col gap-3 p-4 hover:border-blue-400 transition cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {assignment.courseName && (
            <p className="text-xs font-semibold text-blue-600 mb-1 truncate">
              {assignment.courseName}
            </p>
          )}
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2">
            {assignment.name}
          </h3>
        </div>
        <AssignmentStatusBadge
          status={assignment.status}
          isOverdue={assignment.isOverdue}
        />
      </div>

      {assignment.intro && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {assignment.intro}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Tenggat: {formattedDueDate}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          rightIcon={ChevronRight}
          onClick={() => onSelect(assignment)}
          className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
        >
          Lihat Tugas
        </Button>
      </div>
    </Card>
  );
}
