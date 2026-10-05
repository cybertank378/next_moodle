"use client";

import Card from "@/shared-ui/component/Card";
import { Calendar as CalendarIcon } from "lucide-react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import type { ExamSummaryDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";

interface Props {
  upcomingExams?: ExamSummaryDto[];
}

export function StudentCalendarWidget({ upcomingExams }: Props) {
  // Extract exams map by date string for quick lookup
  const examsByDate = upcomingExams?.reduce((acc, exam) => {
    const dateStr = exam.scheduledDate ? exam.scheduledDate.split('T')[0] : new Date().toISOString().split('T')[0];
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(exam);
    return acc;
  }, {} as Record<string, ExamSummaryDto[]>) || {};

  return (
    <Card className="border-slate-100 shadow-sm p-6">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-extrabold flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-slate-700"/> Kalender</h3>
       </div>
       
       <div className="mb-4 text-xs max-w-full overflow-hidden student-react-calendar-wrapper">
          <Calendar
            className="w-full border-none font-sans"
            tileContent={({ date, view }) => {
              if (view === 'month') {
                // Timezone adjustment for local date string matching
                const offset = date.getTimezoneOffset();
                const localDate = new Date(date.getTime() - (offset*60*1000));
                const dateString = localDate.toISOString().split('T')[0];
                
                if (examsByDate[dateString]) {
                  return (
                    <div className="flex justify-center mt-1">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    </div>
                  );
                }
              }
              return null;
            }}
          />
       </div>

       <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mt-6 px-1">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Tugas</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Ujian</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-500"></div> Kegiatan</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Lainnya</div>
       </div>
    </Card>
  );
}
