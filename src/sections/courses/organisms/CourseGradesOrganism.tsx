"use client";

import { Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/libs/routes";
import { useGradeApi } from "@/modules/grades/presentation/hooks/useGradeApi";
import CourseGradeItemCard from "@/sections/courses/molecules/CourseGradeItemCard";
import CourseGradeTeacherNotice from "@/sections/courses/molecules/CourseGradeTeacherNotice";
import CourseGradeTotalCard from "@/sections/courses/molecules/CourseGradeTotalCard";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import EmptyState from "@/shared-ui/component/EmptyState";
import Skeleton from "@/shared-ui/component/Skeleton";

interface CourseGradesOrganismProps {
  courseId: number;
  isTeacher: boolean;
}

export default function CourseGradesOrganism({
  courseId,
  isTeacher,
}: CourseGradesOrganismProps) {
  const router = useRouter();
  const { userReportState, getUserGradeReport } = useGradeApi();

  useEffect(() => {
    if (
      !isTeacher &&
      courseId > 0 &&
      !userReportState.data &&
      !userReportState.loading
    ) {
      void getUserGradeReport(courseId, undefined, { silent: true });
    }
  }, [
    courseId,
    getUserGradeReport,
    isTeacher,
    userReportState.data,
    userReportState.loading,
  ]);

  if (isTeacher) {
    return (
      <div className="space-y-4">
        <CourseGradeTeacherNotice
          onOpenResults={() => router.push(ROUTES.DASHBOARD.RESULTS)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userReportState.loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={`grade-sk-${i}`} className="p-4 space-y-2">
              <Skeleton height={18} width="30%" />
              <Skeleton height={14} width="50%" />
            </Card>
          ))}
        </div>
      )}

      {!userReportState.loading && userReportState.error && (
        <EmptyState
          title="Gagal Memuat Nilai"
          description={userReportState.error}
          action={
            <Button
              size="sm"
              onClick={() =>
                void getUserGradeReport(courseId, undefined, { silent: true })
              }
            >
              Coba Lagi
            </Button>
          }
        />
      )}

      {!userReportState.loading &&
        !userReportState.error &&
        (!userReportState.data?.items ||
          userReportState.data.items.length === 0) && (
          <EmptyState
            title="Belum Ada Nilai Rilis"
            description="Belum ada catatan nilai atau rapor resmi yang dirilis untuk mata pelajaran ini."
            icon={<Award className="w-6 h-6 text-slate-400" />}
          />
        )}

      {!userReportState.loading &&
        !userReportState.error &&
        userReportState.data?.items &&
        userReportState.data.items.length > 0 && (
          <div className="space-y-3">
            {userReportState.data.courseTotal && (
              <CourseGradeTotalCard
                courseTotal={userReportState.data.courseTotal}
              />
            )}

            <div className="space-y-2">
              {userReportState.data.items
                .filter((item) => item.itemType !== "course")
                .map((item) => (
                  <CourseGradeItemCard key={item.id} item={item} />
                ))}
            </div>
          </div>
        )}
    </div>
  );
}
