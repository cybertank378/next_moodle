"use client";

import { StudentCalendarView } from "@/sections/calendar/organisms/StudentCalendarView";

export default function CalendarPageSection() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <StudentCalendarView />
    </div>
  );
}
