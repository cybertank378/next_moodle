"use client";

import CourseDetailView from "@/sections/courses/organisms/CourseDetailView";

export interface CourseDetailPageViewProps {
  courseId: number;
  userRole?: string;
}

export default function CourseDetailPageView({
  courseId,
  userRole,
}: CourseDetailPageViewProps) {
  return <CourseDetailView courseId={courseId} userRole={userRole} />;
}
