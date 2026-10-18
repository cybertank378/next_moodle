"use client";

import { StudentAssignmentListView } from "@/sections/assignments/organisms/StudentAssignmentListView";

interface AssignmentsPageSectionProps {
  role?: string;
}

export default function AssignmentsPageSection({
  role: _role,
}: AssignmentsPageSectionProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <StudentAssignmentListView />
    </div>
  );
}
