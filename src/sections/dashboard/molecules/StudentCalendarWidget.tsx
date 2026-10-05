"use client";

import Card from "@/shared-ui/component/Card";
import { Calendar } from "lucide-react";
import dayGridPlugin from '@fullcalendar/daygrid';
import dynamic from 'next/dynamic';
import type { ExamSummaryDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";

const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });

interface Props {
  upcomingExams?: ExamSummaryDto[];
}

export function StudentCalendarWidget({ upcomingExams }: Props) {
  return (
    <Card className="border-slate-100 shadow-sm p-6">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-extrabold flex items-center gap-2"><Calendar className="w-5 h-5 text-slate-700"/> Kalender</h3>
       </div>
       
       <div className="mb-4 text-xs max-w-full overflow-hidden fullcalendar-student">
          <style>{`
             .fullcalendar-student .fc-toolbar-title {
                font-size: 14px !important;
                font-weight: 700 !important;
                color: #1e293b !important;
             }
             .fullcalendar-student .fc-button-primary {
                background-color: transparent !important;
                border: none !important;
                color: #94a3b8 !important;
                padding: 4px !important;
                box-shadow: none !important;
             }
             .fullcalendar-student .fc-button-primary:hover {
                color: #475569 !important;
                background-color: #f1f5f9 !important;
             }
             .fullcalendar-student .fc-col-header-cell-cushion {
                font-size: 11px !important;
                font-weight: 700 !important;
                color: #94a3b8 !important;
             }
             .fullcalendar-student .fc-daygrid-day-number {
                font-size: 12px !important;
                font-weight: 600 !important;
                color: #334155;
                padding: 4px !important;
             }
             .fullcalendar-student .fc-day-today .fc-daygrid-day-number {
                background-color: #2563eb !important;
                color: white !important;
                border-radius: 9999px;
                width: 24px;
                height: 24px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin: 2px;
             }
             .fullcalendar-student .fc-theme-standard td, .fullcalendar-student .fc-theme-standard th {
                border: none !important;
             }
             .fullcalendar-student .fc-view-harness {
                min-height: 250px;
             }
          `}</style>
          <FullCalendar
             // @ts-ignore
             plugins={[dayGridPlugin]}
             initialView="dayGridMonth"
             headerToolbar={{
                left: 'prev',
                center: 'title',
                right: 'next'
             }}
             height="auto"
             contentHeight="auto"
             fixedWeekCount={false}
             dayMaxEvents={true}
             events={upcomingExams?.map(exam => ({
                title: exam.name,
                date: exam.scheduledDate ? exam.scheduledDate.split('T')[0] : new Date().toISOString().split('T')[0],
                color: '#f97316'
             })) || []}
          />
       </div>
    </Card>
  );
}
