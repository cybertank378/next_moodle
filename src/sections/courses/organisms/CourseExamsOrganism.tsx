"use client";

import { FileQuestion, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/libs/routes";
import { useQuizApi } from "@/modules/quiz/presentation/hooks/useQuizApi";
import CourseQuizCard from "@/sections/courses/molecules/CourseQuizCard";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import EmptyState from "@/shared-ui/component/EmptyState";
import Skeleton from "@/shared-ui/component/Skeleton";
import Typography from "@/shared-ui/component/Typography";

interface CourseExamsOrganismProps {
  courseId: number;
  isTeacher: boolean;
}

export default function CourseExamsOrganism({
  courseId,
  isTeacher,
}: CourseExamsOrganismProps) {
  const router = useRouter();
  const { quizzesState, listQuizzes } = useQuizApi();

  useEffect(() => {
    if (courseId > 0 && !quizzesState.data && !quizzesState.loading) {
      void listQuizzes({ courseId });
    }
  }, [courseId, listQuizzes, quizzesState.data, quizzesState.loading]);

  const handleCreateExam = () => {
    router.push(`${ROUTES.DASHBOARD.EXAMS_CREATE}?courseId=${courseId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <Typography
            variant="h3"
            className="text-base font-bold text-slate-900"
          >
            Daftar Ujian & Kuis
          </Typography>
          <p className="text-xs text-slate-500">
            {isTeacher
              ? "Kelola konfigurasi, pantau, dan buat ujian untuk mata pelajaran ini."
              : "Daftar ujian dan kuis aktif yang dapat Anda ikuti."}
          </p>
        </div>
        {isTeacher && (
          <Button
            size="sm"
            color="primary"
            leftIcon={Plus}
            onClick={handleCreateExam}
          >
            Buat Ujian Baru
          </Button>
        )}
      </div>

      {quizzesState.loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={`quiz-sk-${i}`} className="p-5 space-y-3">
              <Skeleton height={20} width="40%" />
              <Skeleton height={14} width="70%" />
            </Card>
          ))}
        </div>
      )}

      {!quizzesState.loading && quizzesState.error && (
        <EmptyState
          title="Gagal Memuat Daftar Ujian"
          description={quizzesState.error}
          action={
            <Button size="sm" onClick={() => void listQuizzes({ courseId })}>
              Coba Lagi
            </Button>
          }
        />
      )}

      {!quizzesState.loading &&
        !quizzesState.error &&
        (!quizzesState.data?.quizzes ||
          quizzesState.data.quizzes.length === 0) && (
          <EmptyState
            title={
              isTeacher ? "Belum Ada Ujian / Kuis" : "Tidak Ada Ujian Aktif"
            }
            description={
              isTeacher
                ? "Belum ada ujian atau kuis yang dibuat untuk mata pelajaran ini. Klik tombol di bawah untuk membuat ujian baru."
                : "Belum ada ujian atau kuis yang dijadwalkan untuk mata pelajaran ini."
            }
            icon={<FileQuestion className="w-6 h-6 text-slate-400" />}
            action={
              isTeacher ? (
                <Button
                  size="sm"
                  color="primary"
                  leftIcon={Plus}
                  onClick={handleCreateExam}
                >
                  Buat Ujian Baru
                </Button>
              ) : undefined
            }
          />
        )}

      {!quizzesState.loading &&
        !quizzesState.error &&
        quizzesState.data?.quizzes &&
        quizzesState.data.quizzes.length > 0 && (
          <div className="space-y-3">
            {quizzesState.data.quizzes.map((quiz) => (
              <CourseQuizCard
                key={quiz.id}
                quiz={quiz}
                isTeacher={isTeacher}
                onMonitor={() =>
                  router.push(ROUTES.DASHBOARD.EXAM_MONITOR(quiz.id))
                }
                onEdit={() => router.push(ROUTES.DASHBOARD.EXAM_EDIT(quiz.id))}
                onDetail={() =>
                  router.push(ROUTES.DASHBOARD.EXAM_DETAIL(quiz.id))
                }
                onTakeExam={() =>
                  router.push(ROUTES.DASHBOARD.EXAM_DETAIL(quiz.id))
                }
              />
            ))}
          </div>
        )}
    </div>
  );
}
