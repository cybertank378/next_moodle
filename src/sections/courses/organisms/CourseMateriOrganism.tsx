"use client";

import { BookOpen, Info, Layers } from "lucide-react";
import type { CourseSectionResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import CourseHtmlContent from "@/sections/courses/atoms/CourseHtmlContent";
import CourseModuleItem from "@/sections/courses/molecules/CourseModuleItem";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import EmptyState from "@/shared-ui/component/EmptyState";
import Typography from "@/shared-ui/component/Typography";

interface CourseMateriOrganismProps {
  sections: CourseSectionResponseDTO[];
  isTeacher: boolean;
  onGoToExamsTab: () => void;
}

export default function CourseMateriOrganism({
  sections,
  isTeacher,
  onGoToExamsTab,
}: CourseMateriOrganismProps) {
  return (
    <div className="space-y-4">
      {isTeacher && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-900">
          <div className="flex items-center gap-3">
            <Info size={20} className="text-blue-600 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">Manajemen Materi & Kuis Pengajar</p>
              <p className="text-blue-700">
                Anda dapat meninjau topik materi dan mengelola kuis atau ujian
                mata pelajaran ini secara langsung.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            color="primary"
            variant="outline"
            onClick={onGoToExamsTab}
            className="shrink-0"
          >
            Buka Tab Ujian
          </Button>
        </div>
      )}

      {sections.length === 0 ? (
        <EmptyState
          title="Belum Ada Konten Pembelajaran"
          description="Topik dan materi pembelajaran belum ditambahkan pada sistem Moodle."
          icon={<BookOpen className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        sections.map((section) => (
          <Card
            key={section.id}
            className="p-5 sm:p-6 space-y-4 border border-slate-200/80 shadow-xs"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers size={18} className="text-blue-600 shrink-0" />
              <Typography
                variant="h3"
                className="text-base font-bold text-slate-900"
              >
                {section.name || `Topik ${section.sectionNumber}`}
              </Typography>
            </div>

            {section.summary && (
              <CourseHtmlContent
                content={section.summary}
                className="text-xs line-clamp-3"
              />
            )}


            {section.modules.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                Tidak ada modul pembelajaran pada topik ini.
              </p>
            ) : (
              <div className="space-y-2.5 pt-1">
                {section.modules.map((mod) => (
                  <CourseModuleItem
                    key={mod.id}
                    module={mod}
                    isTeacher={isTeacher}
                    onTakeExam={onGoToExamsTab}
                    onManageExam={onGoToExamsTab}
                  />
                ))}
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
