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
       <style>{`
          .student-react-calendar-wrapper .react-calendar {
             width: 100%;
             border: none;
             background: transparent;
             font-family: inherit;
          }
          .student-react-calendar-wrapper .react-calendar__navigation {
             margin-bottom: 1rem;
          }
          .student-react-calendar-wrapper .react-calendar__navigation button {
             min-width: 44px;
             background: none;
             font-weight: 700;
             font-size: 14px;
             color: #1e293b;
             border-radius: 12px;
             padding: 8px;
             transition: all 0.2s;
          }
          .student-react-calendar-wrapper .react-calendar__navigation button:enabled:hover,
          .student-react-calendar-wrapper .react-calendar__navigation button:enabled:focus {
             background-color: #f1f5f9;
          }
          .student-react-calendar-wrapper .react-calendar__navigation button[disabled] {
             background-color: transparent;
             color: #cbd5e1;
          }
          .student-react-calendar-wrapper .react-calendar__month-view__weekdays {
             font-size: 0.7rem;
             text-transform: uppercase;
             font-weight: 800;
             color: #64748b;
             text-decoration: none;
          }
          .student-react-calendar-wrapper .react-calendar__month-view__weekdays__weekday {
             padding: 0.5em;
             text-align: center;
          }
          .student-react-calendar-wrapper .react-calendar__month-view__weekdays__weekday abbr {
             text-decoration: none;
          }
          .student-react-calendar-wrapper .react-calendar__month-view__days__day--weekend {
             color: #ef4444;
          }
          .student-react-calendar-wrapper .react-calendar__tile {
             padding: 10px 6px;
             background: none;
             text-align: center;
             font-weight: 600;
             font-size: 13px;
             color: #334155;
             border-radius: 12px;
             transition: all 0.2s;
             display: flex;
             flex-direction: column;
             align-items: center;
             justify-content: flex-start;
             aspect-ratio: 1 / 1;
          }
          .student-react-calendar-wrapper .react-calendar__tile:enabled:hover,
          .student-react-calendar-wrapper .react-calendar__tile:enabled:focus {
             background-color: #f8fafc;
             color: #2563eb;
          }
          .student-react-calendar-wrapper .react-calendar__tile--now {
             background: #eff6ff;
             color: #2563eb;
             font-weight: 800;
          }
          .student-react-calendar-wrapper .react-calendar__tile--now:enabled:hover,
          .student-react-calendar-wrapper .react-calendar__tile--now:enabled:focus {
             background: #dbeafe;
          }
          .student-react-calendar-wrapper .react-calendar__tile--active {
             background: #2563eb !important;
             color: white !important;
             font-weight: 800;
             box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);
          }
          .student-react-calendar-wrapper .react-calendar__month-view__days__day--neighboringMonth {
             color: #cbd5e1;
             font-weight: 500;
          }
       `}</style>

       <div className="mb-2 max-w-full overflow-hidden student-react-calendar-wrapper">
          <Calendar
            className="w-full border-none font-sans"
            next2Label={null}
            prev2Label={null}
            tileContent={({ date, view }) => {
              if (view === 'month') {
                // Timezone adjustment for local date string matching
                const offset = date.getTimezoneOffset();
                const localDate = new Date(date.getTime() - (offset*60*1000));
                const dateString = localDate.toISOString().split('T')[0];
                
                if (examsByDate[dateString]) {
                  return (
                    <div className="flex justify-center mt-1.5 w-full">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-sm"></div>
                    </div>
                  );
                }
              }
              return null;
            }}
          />
       </div>

       <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mt-6 px-1">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div> Tugas</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm"></div> Ujian</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-sm"></div> Kegiatan</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-sm"></div> Lainnya</div>
       </div>
    </Card>
  );
}
