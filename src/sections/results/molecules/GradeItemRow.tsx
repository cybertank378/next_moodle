import { FileText, HelpCircle, Layers } from "lucide-react";
import type { GradeItemResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import GradeStatusBadge from "@/sections/results/atoms/GradeStatusBadge";

export interface GradeItemRowProps {
  item: GradeItemResponseDto;
  className?: string;
}

export default function GradeItemRow({
  item,
  className = "",
}: GradeItemRowProps) {
  const getIcon = () => {
    if (item.itemModule === "quiz") {
      return <HelpCircle size={18} className="text-sky-400" />;
    }
    if (item.itemType === "course") {
      return <Layers size={18} className="text-purple-400" />;
    }
    return <FileText size={18} className="text-emerald-400" />;
  };

  return (
    <div
      data-testid={`grade-item-row-${item.id}`}
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200  bg-white  p-4 shadow-sm transition-colors hover:border-slate-300  ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg border border-slate-200  bg-slate-50  p-2 text-slate-600 ">
          {getIcon()}
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 ">{item.itemName}</h4>
          <p className="text-xs text-slate-500 ">
            Tipe: {item.itemModule || item.itemType} • Batas Kelulusan:{" "}
            {item.gradePass !== null ? item.gradePass : "-"}
          </p>
          {item.feedback && (
            <p className="mt-1 text-xs italic text-sky-600 ">
              Catatan: &ldquo;{item.feedback}&rdquo;
            </p>
          )}
        </div>
      </div>

      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 border-t border-slate-200  sm:border-0 pt-3 sm:pt-0">
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-900 ">
              {item.gradeFormatted}
            </span>
            <span className="text-xs text-slate-500 ">/ {item.gradeMax}</span>
          </div>
          {item.percentageFormatted && (
            <p className="text-xs text-slate-500  font-medium">
              {item.percentageFormatted}
            </p>
          )}
        </div>

        <GradeStatusBadge isPassed={item.isPassed} />
      </div>
    </div>
  );
}
