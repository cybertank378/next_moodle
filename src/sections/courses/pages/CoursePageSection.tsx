"use client";

import React from "react";
import { CourseListView } from "../organisms/CourseListView";

export function CoursePageSection() {
  const handleCourseClick = (courseId: string) => {
    // Navigate to course detail or quizzes page
    window.location.href = `/courses/${courseId}`;
  };

  return (
    <section className="container mx-auto px-4 py-8 max-w-7xl">
      <CourseListView onCourseClick={handleCourseClick} />
    </section>
  );
}
