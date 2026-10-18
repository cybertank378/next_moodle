"use client";

import React from "react";
import type { ActivityType } from "@/sections/exam/molecules/ActivityTypeSelector";
import CreateActivityOrganism from "@/sections/exam/organisms/CreateActivityOrganism";

interface CreateActivityPageViewProps {
  courseId: number;
  initialType?: ActivityType;
}

export default function CreateActivityPageView({
  courseId,
  initialType = "quiz",
}: CreateActivityPageViewProps) {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <CreateActivityOrganism courseId={courseId} initialType={initialType} />
    </div>
  );
}
