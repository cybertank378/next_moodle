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
    <div className="space-y-6">
      {/* Back button and page title */}
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          color="secondary"
          iconOnly
          leftIcon={ArrowLeft}
          onClick={onNavigateBack}
          aria-label="Kembali ke daftar mata pelajaran"
        />
        <div>
          <Typography
            variant="caption"
            className="text-xs uppercase font-bold tracking-wider text-slate-400"
          >
            Mata Pelajaran
          </Typography>
          <Typography
            variant="h1"
            className="text-xl sm:text-2xl font-bold text-slate-900"
          >
            {course.displayName || "Detail Mata Pelajaran"}
          </Typography>
        </div>
      </div>

      {/* Hero Card */}
      <Card className="p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
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
              className="text-2xl sm:text-3xl font-extrabold text-slate-900"
            >
              {course.fullName}
            </Typography>

            {course.summary ? (
              <CourseHtmlContent
                content={course.summary}
                className="text-sm line-clamp-3"
              />
            ) : (
              <p className="text-sm text-slate-400 italic">
                Belum ada deskripsi singkat untuk mata pelajaran ini.
              </p>
            )}
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
    </div>
  );
}
