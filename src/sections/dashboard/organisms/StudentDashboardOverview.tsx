"use client";

import { useEffect } from "react";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";
import Skeleton from "@/shared-ui/component/Skeleton";

import { StudentWelcomeBanner } from "@/sections/dashboard/molecules/StudentWelcomeBanner";
import { StudentStatCards } from "@/sections/dashboard/molecules/StudentStatCards";
import { StudentActiveCourses } from "@/sections/dashboard/molecules/StudentActiveCourses";
import { StudentUpcomingTasks } from "@/sections/dashboard/molecules/StudentUpcomingTasks";
import { StudentRecentGrades } from "@/sections/dashboard/molecules/StudentRecentGrades";
import { StudentResumeLearning } from "@/sections/dashboard/molecules/StudentResumeLearning";
import { StudentCalendarWidget } from "@/sections/dashboard/molecules/StudentCalendarWidget";
import { StudentRightRailWidgets } from "@/sections/dashboard/molecules/StudentRightRailWidgets";

export default function StudentDashboardOverview() {
  const { studentState, fetchStudentOverview } = useDashboardApi();

  useEffect(() => {
    fetchStudentOverview();
  }, [fetchStudentOverview]);

  const { data, loading, error } = studentState;

  if (loading) {
    return (
      <div className="flex flex-col xl:flex-row gap-6 animate-pulse p-4 max-w-[1600px] mx-auto w-full">
         <div className="flex-1 space-y-6">
            <Skeleton height={140} rounded className="rounded-3xl" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <Skeleton height={100} rounded className="rounded-2xl" count={4} />
            </div>
            <Skeleton height={300} rounded className="rounded-2xl" />
         </div>
         <div className="w-full xl:w-96 shrink-0 space-y-6">
            <Skeleton height={400} rounded className="rounded-2xl" />
            <Skeleton height={300} rounded className="rounded-2xl" />
         </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        Gagal memuat: {error}
      </div>
    );
  }

  const totalCourses = data?.courses?.length || 0;
  const activeExams = data?.upcomingExams?.filter(e => e.status === "open").length || 0;
  const avgProgress = data?.courses && data.courses.length > 0 
    ? Math.round(data.courses.reduce((acc, curr) => acc + (curr.progress || 0), 0) / data.courses.length) 
    : 0;

  const avgGradeScore = data?.recentGrades?.length 
    ? Math.round(data.recentGrades.reduce((acc, curr) => acc + curr.score, 0) / data.recentGrades.length) 
    : 0;

  const GRADE_THRESHOLDS = [
    { min: 90, letter: 'A' }, { min: 85, letter: 'A-' }, { min: 80, letter: 'B+' },
    { min: 75, letter: 'B' }, { min: 70, letter: 'B-' }, { min: 60, letter: 'C' },
    { min: 0, letter: 'D' }
  ];
  
  const avgGradeLetter = avgGradeScore > 0 
    ? GRADE_THRESHOLDS.find(t => avgGradeScore >= t.min)?.letter || 'D'
    : "-";

  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 w-full max-w-[1600px] mx-auto">
      
      {/* LEFT COLUMN - Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        <StudentWelcomeBanner profile={data?.profile} />
        
        <StudentStatCards 
           totalCourses={totalCourses} 
           activeExams={activeExams} 
           avgGradeScore={avgGradeScore} 
           avgGradeLetter={avgGradeLetter} 
           avgProgress={avgProgress} 
        />

        <StudentActiveCourses courses={data?.courses} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <StudentUpcomingTasks upcomingExams={data?.upcomingExams} />
           <StudentRecentGrades recentGrades={data?.recentGrades} />
        </div>

        <StudentResumeLearning courses={data?.courses} />
      </div>
      
      {/* RIGHT RAIL */}
      <div className="w-full xl:w-96 shrink-0 space-y-6">
         <StudentCalendarWidget upcomingExams={data?.upcomingExams} />
         <StudentRightRailWidgets />
      </div>
    </div>
  );
}

