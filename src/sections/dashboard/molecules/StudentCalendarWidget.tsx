"use client";

import Card from "@/shared-ui/component/Card";
import { Calendar } from "lucide-react";
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import type { ExamSummaryDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";

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
