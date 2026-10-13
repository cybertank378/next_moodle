"use client";

import { StudentScheduleView } from "@/sections/schedule/organisms/StudentScheduleView";
import { TeacherScheduleView } from "@/sections/schedule/organisms/TeacherScheduleView";
import { TenantScheduleManagementView } from "@/sections/schedule/organisms/TenantScheduleManagementView";

interface SchedulePageSectionProps {
  role?: string;
}

export default function SchedulePageSection({
  role,
}: SchedulePageSectionProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {role === "TENANT" || role === "ADMIN" ? (
        <TenantScheduleManagementView />
      ) : role === "TEACHER" ? (
        <TeacherScheduleView />
      ) : (
        <StudentScheduleView />
      )}
    </div>
  );
}
