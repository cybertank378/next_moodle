"use client";

import { Info, Layers } from "lucide-react";
import type {
  CourseSectionResponseDTO,
  CourseSummaryResponseDTO,
} from "@/modules/course/domain/dto/CourseResponseDto";
import CourseHtmlContent from "@/sections/courses/atoms/CourseHtmlContent";
import CourseOverviewInfoCard from "@/sections/courses/molecules/CourseOverviewInfoCard";
import CourseTopicItem from "@/sections/courses/molecules/CourseTopicItem";
import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";

interface CourseOverviewOrganismProps {
  course: CourseSummaryResponseDTO;
  sections: CourseSectionResponseDTO[];
  isTeacher: boolean;
  onOpenMateri: () => void;
}

export default function CourseOverviewOrganism({
  course,
  sections,
  isTeacher,
  onOpenMateri,
}: CourseOverviewOrganismProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        {course.summary ? (
          <Card className="p-5 space-y-3 border border-slate-200/80 shadow-xs">
            <Typography
              variant="h3"
              className="font-bold text-slate-900 flex items-center gap-2 text-base"
            >
              <Info size={16} className="text-blue-600" />
              Tentang Mata Pelajaran
            </Typography>
            <CourseHtmlContent
              content={course.summary}
              className="text-sm"
            />
          </Card>
        ) : null}

        <Card className="p-5 space-y-3.5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <Typography
              variant="h3"
              className="font-bold text-slate-900 flex items-center gap-2 text-base"
            >
              <Layers size={16} className="text-blue-600" />
              Struktur Topik Pembelajaran
            </Typography>
            <span className="text-xs text-slate-400 font-medium">
              {sections.length} Topik
            </span>
          </div>

          {sections.length === 0 ? (
            <p className="text-sm text-slate-500 italic py-2">
              Belum ada topik atau bab pada mata pelajaran ini.
            </p>
          ) : (
            <div className="space-y-2.5">
              {sections.map((section, sIdx) => (
                <CourseTopicItem
                  key={section.id}
                  index={sIdx}
                  section={section}
                  onOpenMateri={onOpenMateri}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Sidebar Info */}
      <div className="space-y-5">
        <CourseOverviewInfoCard course={course} isTeacher={isTeacher} />
      </div>
    </div>
  );
}
