"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES } from "@/libs/routes";
import type { CourseSectionResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import { useCourseApi } from "@/modules/course/presentation/hooks/useCourseApi";
import CourseFeaturePlaceholder from "@/sections/courses/molecules/CourseFeaturePlaceholder";
import CourseTabNav, {
  type CourseTab,
} from "@/sections/courses/molecules/CourseTabNav";
import CourseExamsOrganism from "@/sections/courses/organisms/CourseExamsOrganism";
import CourseGradesOrganism from "@/sections/courses/organisms/CourseGradesOrganism";
import CourseHeroOrganism from "@/sections/courses/organisms/CourseHeroOrganism";
import CourseMateriOrganism from "@/sections/courses/organisms/CourseMateriOrganism";
import CourseOverviewOrganism from "@/sections/courses/organisms/CourseOverviewOrganism";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import EmptyState from "@/shared-ui/component/EmptyState";
import Skeleton from "@/shared-ui/component/Skeleton";
import { showErrorToast } from "@/shared-ui/component/Toast";
import Typography from "@/shared-ui/component/Typography";

export interface CourseDetailViewProps {
  courseId: number;
  userRole?: string;
}

export default function CourseDetailView({
  courseId,
  userRole,
}: CourseDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CourseTab>("overview");

  const isTeacher =
    userRole === "TEACHER" || userRole === "TENANT" || userRole === "ADMIN";

  const { detailState, getCourseDetail } = useCourseApi();

  const handleNavigateToCourses = () => {
    router.push(ROUTES.DASHBOARD.COURSES);
  };

  useEffect(() => {
    if (courseId > 0) {
      void getCourseDetail(courseId);
    }
  }, [courseId, getCourseDetail]);

  useEffect(() => {
    if (detailState.error) {
      showErrorToast(detailState.error);
    }
  }, [detailState.error]);

  const course = detailState.data?.course;
  const sections: CourseSectionResponseDTO[] = detailState.data?.sections ?? [];
  const loading = detailState.loading;

  const totalModules = sections.reduce(
    (acc, sec) => acc + (sec.modules?.length || 0),
    0,
  );

  return (
    <div className="space-y-6 mx-auto pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {detailState.error && (
        <EmptyState
          title="Gagal Memuat Mata Pelajaran"
          description={detailState.error}
          action={
            <Button size="sm" onClick={() => void getCourseDetail(courseId)}>
              Coba Lagi
            </Button>
          }
        />
      )}

      {loading && (
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
                <Skeleton width={240} height={28} />
              </Typography>
            </div>
          </div>
          <Card className="p-6 sm:p-8 space-y-4">
            <Skeleton height={32} width="50%" />
            <Skeleton height={18} width="80%" />
            <div className="pt-4 flex gap-4">
              <Skeleton height={40} width={120} rounded />
              <Skeleton height={40} width={120} rounded />
            </div>
          </Card>
          <Card className="p-6 space-y-4">
            <Skeleton height={28} width="30%" />
            <Skeleton height={60} width="100%" />
            <Skeleton height={60} width="100%" />
          </Card>
        </div>
      )}

      {!loading && course && (
        <>
          <CourseHeroOrganism
            course={course}
            totalTopics={sections.length}
            totalModules={totalModules}
            isTeacher={isTeacher}
            onNavigateBack={handleNavigateToCourses}
            onManageExams={() => setActiveTab("ujian")}
          />

          <CourseTabNav activeTab={activeTab} onSelectTab={setActiveTab} />

          {activeTab === "overview" && (
            <CourseOverviewOrganism
              course={course}
              sections={sections}
              isTeacher={isTeacher}
              onOpenMateri={() => setActiveTab("materi")}
            />
          )}

          {activeTab === "materi" && (
            <CourseMateriOrganism
              sections={sections}
              isTeacher={isTeacher}
              onGoToExamsTab={() => setActiveTab("ujian")}
            />
          )}

          {activeTab === "ujian" && (
            <CourseExamsOrganism courseId={course.id} isTeacher={isTeacher} />
          )}

          {activeTab === "nilai" && (
            <CourseGradesOrganism courseId={course.id} isTeacher={isTeacher} />
          )}

          {activeTab === "tugas" && (
            <CourseFeaturePlaceholder
              featureName="Tugas (Assignment)"
              moduleName="mod_assign"
            />
          )}
        </>
      )}
    </div>
  );
}
