"use client";

import clsx from "clsx";
import type { FC } from "react";
import type { CalendarEventItemDTO } from "@/modules/calendar/domain/dto/CalendarResponseDTO";

interface CalendarDayDotProps {
  events: CalendarEventItemDTO[];
  maxDisplay?: number;
}

export const CalendarDayDot: FC<CalendarDayDotProps> = ({
  events,
  maxDisplay = 3,
}) => {
  if (!events || events.length === 0) return null;

  const displayEvents = events.slice(0, maxDisplay);
  const remaining = events.length - maxDisplay;

  return (
    <div className="flex flex-col items-center gap-0.5 mt-1 w-full px-1">
      <div className="flex items-center gap-1 justify-center flex-wrap">
        {displayEvents.map((ev) => (
          <span
            key={ev.id}
            title={ev.title}
            className={clsx(
              "w-1.5 h-1.5 rounded-full inline-block",
              ev.sourceType === "QUIZ_EXAM" && "bg-indigo-600",
              ev.sourceType === "COURSE_CLASS" && "bg-cyan-500",
              ev.sourceType === "ASSIGNMENT_DUE" && "bg-amber-500",
              ev.sourceType === "ANNOUNCEMENT" && "bg-slate-400",
              ev.sourceType === "ACADEMIC_EVENT" && "bg-emerald-500",
            )}
          />
        ))}
      </div>
      {remaining > 0 && (
        <span className="text-[10px] text-slate-500 font-medium">
          +{remaining}
        </span>
      )}
    </div>
  );
};
