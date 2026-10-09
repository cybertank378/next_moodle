"use client";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/libs/routes";
import type {
  CourseModuleResponseDTO,
  CourseSectionResponseDTO,
} from "@/modules/course/domain/dto/CourseResponseDto";
import { useCourseApi } from "@/modules/course/presentation/hooks/useCourseApi";
import Button from "@/shared-ui/component/Button";
import Skeleton from "@/shared-ui/component/Skeleton";
import { showErrorToast } from "@/shared-ui/component/Toast";

interface CourseDetailViewProps {
  courseId: number;
}

export default function CourseDetailView({ courseId }: CourseDetailViewProps) {
  const router = useRouter();
  const { contentsState, getCourseContents } = useCourseApi();

  const handleNavigateToCourses = () => {
    router.push(ROUTES.DASHBOARD.COURSES);
  };

  const handleNavigateToExams = () => {
    router.push(ROUTES.DASHBOARD.EXAMS);
  };

  useEffect(() => {
    if (courseId) {
      void getCourseContents(courseId);
    }
  }, [courseId, getCourseContents]);

  useEffect(() => {
    if (contentsState.error) {
      showErrorToast(contentsState.error);
    }
  }, [contentsState.error]);

  const sections: CourseSectionResponseDTO[] = contentsState.data ?? [];
  const loading = contentsState.loading;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          color="secondary"
          iconOnly
          leftIcon={ArrowLeft}
          onClick={handleNavigateToCourses}
          aria-label="Kembali ke daftar mata pelajaran"
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 ">
            Detail Mata Pelajaran
          </h1>
          <p className="text-sm text-slate-500 ">
            Konten materi, kuis, dan topik pembelajaran.
          </p>
        </div>
      </div>

      {contentsState.error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
          {contentsState.error}
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((idx) => (
            <div
              key={`section-skeleton-${idx}`}
              className="rounded-xl border border-slate-200  bg-white  p-6 space-y-4 shadow-sm"
            >
              <Skeleton height={24} width={200} />
              <div className="space-y-2 pt-2">
                <Skeleton height={36} />
                <Skeleton height={36} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && sections.length === 0 && !contentsState.error && (
        <div className="rounded-xl border border-slate-200  bg-white  p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100  text-slate-500 ">
            <BookOpen size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900 ">
            Belum ada konten mata pelajaran
          </h3>
          <p className="mt-1 text-xs text-slate-500  max-w-sm mx-auto">
            Mata Pelajaran ini belum memiliki topik atau modul pembelajaran di Moodle.
          </p>
        </div>
      )}

      {!loading && sections.length > 0 && (
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="rounded-xl border border-slate-200  bg-white  p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-slate-200  pb-3">
                <Layers
                  size={18}
                  className="text-indigo-600 "
                />
                <h3 className="text-base font-semibold text-slate-900 ">
                  {section.name || `Topik ${section.sectionNumber}`}
                </h3>
              </div>

              {section.summary && (
                <div
                  className="prose  text-xs text-slate-600  max-w-none line-clamp-3"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized Moodle summary
                  dangerouslySetInnerHTML={{ __html: section.summary }}
                />
              )}

              {section.modules.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  Tidak ada modul pada topik ini.
                </p>
              ) : (
                <div className="space-y-2 pt-1">
                  {section.modules.map((mod: CourseModuleResponseDTO) => {
                    const isQuiz = mod.modName.toLowerCase() === "quiz";
                    return (
                      <div
                        key={mod.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200  bg-slate-50  p-3 hover:border-slate-300  transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              isQuiz
                                ? "bg-amber-500/10 text-amber-500 "
                                : "bg-indigo-500/10 text-indigo-600 "
                            }`}
                          >
                            {isQuiz ? (
                              <HelpCircle size={16} />
                            ) : (
                              <FileText size={16} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 ">
                              {mod.name}
                            </p>
                            <span className="text-[10px] uppercase font-semibold text-slate-500  tracking-wider">
                              {mod.modName}
                            </span>
                          </div>
                        </div>

                        {isQuiz && (
                          <Button
                            size="sm"
                            variant="label"
                            color="warning"
                            leftIcon={CheckCircle2}
                            onClick={handleNavigateToExams}
                          >
                            Lihat Ujian
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
