"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppRouteConstants } from "@/libs/routes";
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

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#151521] p-5 transition-all duration-200 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CourseCategoryBadge format={course.format} />
          <CourseProgressBadge
            progress={course.progress}
            isCompleted={course.isCompleted}
          />
        </div>

        <div className="flex items-start gap-3 pt-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-600/20">
            <BookOpen size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {course.shortName}
            </p>
            <h3 className="truncate text-base font-bold text-white hover:text-indigo-300">
              {course.displayName}
            </h3>
          </div>
        </div>

        {cleanSummary && (
          <p className="line-clamp-2 text-xs text-slate-400 leading-relaxed">
            {cleanSummary}
          </p>
        )}
      </div>

      <div className="mt-5 border-t border-slate-800/80 pt-4">
        <Button
          size="sm"
          color="primary"
          variant="filled"
          fullWidth
          rightIcon={ArrowRight}
          onClick={() => router.push(AppRouteConstants.courseDetail(course.id))}
        >
          Buka Kursus
        </Button>
      </div>
    </div>
  );
}
