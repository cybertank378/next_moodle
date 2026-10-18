"use client";

import { ArrowLeft } from "lucide-react";
import type { CourseSummaryResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import CourseHtmlContent from "@/sections/courses/atoms/CourseHtmlContent";
import CourseProgressBadge from "@/sections/courses/atoms/CourseProgressBadge";
import CourseHeroStudentProgress from "@/sections/courses/molecules/CourseHeroStudentProgress";
import CourseHeroTeacherSummary from "@/sections/courses/molecules/CourseHeroTeacherSummary";
import Badge from "@/shared-ui/component/Badge";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";

interface CourseHeroOrganismProps {
  course: CourseSummaryResponseDTO;
  totalTopics: number;
  totalModules: number;
  isTeacher: boolean;
  onNavigateBack: () => void;
  onManageExams: () => void;
}

export default function CourseHeroOrganism({
  course,
  totalTopics,
  totalModules,
  isTeacher,
  onNavigateBack,
  onManageExams,
}: CourseHeroOrganismProps) {
  return (
    <Card className="p-5 sm:p-6 border border-slate-200/80 shadow-xs relative overflow-hidden bg-gradient-to-br from-white via-slate-50/40 to-blue-50/20">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
        <div className="flex items-start gap-3.5 max-w-3xl">
          <Button
            size="sm"
            variant="outline"
            color="secondary"
            iconOnly
            leftIcon={ArrowLeft}
            onClick={onNavigateBack}
            className="mt-0.5 shrink-0"
            aria-label="Kembali ke daftar mata pelajaran"
          />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge color="primary" variant="soft">
                {course.shortName}
              </Badge>
              {isTeacher ? (
                <Badge color="info" variant="soft">
                  Akses Pengajar
                </Badge>
              ) : (
                <CourseProgressBadge
                  progress={course.progress}
                  isCompleted={course.isCompleted}
                />
              )}
              {course.format && (
                <Badge color="secondary" variant="outline">
                  Format: {course.format}
                </Badge>
              )}
            </div>


            <Typography
              variant="h1"
              className="text-xl sm:text-2xl font-bold text-slate-900"
            >
              {course.fullName || course.displayName}
            </Typography>

            {course.summary ? (
              <CourseHtmlContent
                content={course.summary}
                className="text-xs text-slate-600 line-clamp-2"
              />
            ) : null}
          </div>
        </div>

        {/* Role Summary Card */}
        {isTeacher ? (
          <CourseHeroTeacherSummary
            topicCount={totalTopics}
            moduleCount={totalModules}
            onManageExams={onManageExams}
          />
        ) : (
          <CourseHeroStudentProgress
            progress={course.progress}
            topicCount={totalTopics}
            moduleCount={totalModules}
          />
        )}
      </div>
    </Card>
  );
}
