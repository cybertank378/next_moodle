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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6 space-y-4 border border-slate-200/80 shadow-xs">
          <Typography
            variant="h3"
            className="font-bold text-slate-900 flex items-center gap-2"
          >
            <Info size={18} className="text-blue-600" />
            Tentang Mata Pelajaran
          </Typography>
          {course.summary ? (
            <CourseHtmlContent
              content={course.summary}
              className="text-sm"
            />
          ) : (
            <p className="text-sm text-slate-500">
              Tidak ada informasi deskripsi tambahan yang disediakan.
            </p>
          )}
        </Card>


        <Card className="p-6 space-y-4 border border-slate-200/80 shadow-xs">
          <Typography
            variant="h3"
            className="font-bold text-slate-900 flex items-center gap-2"
          >
            <Layers size={18} className="text-blue-600" />
            Struktur Topik Pembelajaran
          </Typography>
          {sections.length === 0 ? (
            <p className="text-sm text-slate-500 italic">
              Belum ada topik atau bab pada mata pelajaran ini.
            </p>
          ) : (
            <div className="space-y-3">
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
      <div className="space-y-6">
        <CourseOverviewInfoCard course={course} isTeacher={isTeacher} />
      </div>
    </div>
  );
}
