"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import { stripHtml } from "@/libs/utils";
import type { CourseSummaryResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import CourseCategoryBadge from "@/sections/courses/atoms/CourseCategoryBadge";
import CourseProgressBadge from "@/sections/courses/atoms/CourseProgressBadge";
import Button from "@/shared-ui/component/Button";

interface Props {
  course: CourseSummaryResponseDTO;
}

export default function CourseCard({ course }: Props) {
  const router = useRouter();
  const cleanSummary = stripHtml(course.summary);

  const handleNavigateToCourseDetail = () => {
    router.push(ROUTES.DASHBOARD.COURSE_DETAIL(course.id));
  };

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200  bg-white  p-5 shadow-sm transition-all duration-200 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CourseCategoryBadge format={course.format} />
          <CourseProgressBadge
            progress={course.progress}
            isCompleted={course.isCompleted}
          />
        </div>

        <div className="flex items-start gap-3 pt-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600  border border-indigo-600/20">
            <BookOpen size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 ">
              {course.shortName}
            </p>
            <h3 className="truncate text-base font-bold text-slate-900  hover:text-indigo-600 ">
              {course.displayName}
            </h3>
          </div>
        </div>

        {cleanSummary && (
          <p className="line-clamp-2 text-xs text-slate-600  leading-relaxed">
            {cleanSummary}
          </p>
        )}
      </div>

      <div className="mt-5 border-t border-slate-200  pt-4">
        <Button
          size="sm"
          color="primary"
          variant="filled"
          fullWidth
          rightIcon={ArrowRight}
          onClick={handleNavigateToCourseDetail}
        >
          Buka Mata Pelajaran
        </Button>
      </div>
    </div>
  );
}
