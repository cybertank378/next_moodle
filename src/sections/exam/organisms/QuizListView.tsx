"use client";

import { HelpCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuizApi } from "@/modules/quiz/presentation/hooks/useQuizApi";
import QuizCard from "@/sections/exam/molecules/QuizCard";
import QuizFilterBar, {
  type QuizTabFilter,
} from "@/sections/exam/molecules/QuizFilterBar";
import EmptyState from "@/shared-ui/component/EmptyState";
import Skeleton from "@/shared-ui/component/Skeleton";
import { showErrorToast } from "@/shared-ui/component/Toast";

interface Props {
  courseId?: number;
}

export default function QuizListView({ courseId }: Props) {
  const { quizzesState, listQuizzes } = useQuizApi();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuizTabFilter>("ALL");

  useEffect(() => {
    void listQuizzes({ courseId, search });
  }, [courseId, listQuizzes, search]);

  useEffect(() => {
    if (quizzesState.error) {
      showErrorToast(quizzesState.error);
    }
  }, [quizzesState.error]);

  const rawQuizzes = quizzesState.data?.quizzes ?? [];
  const loading = quizzesState.loading;

  const filteredQuizzes = useMemo(() => {
    if (statusFilter === "ALL") return rawQuizzes;
    return rawQuizzes.filter((q) => q.status === statusFilter);
  }, [rawQuizzes, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 ">
          Portal Ujian & Kuis
        </h1>
        <p className="text-sm text-slate-500 ">
          Daftar ujian aktif, kuis topik, dan evaluasi pembelajaran peserta.
        </p>
      </div>

      <QuizFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {loading && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={`quiz-skeleton-${idx}`}
              className="rounded-xl border border-slate-200  bg-white  p-5 space-y-4 shadow-sm"
            >
              <div className="flex justify-between">
                <Skeleton height={20} width={80} />
                <Skeleton height={20} width={70} />
              </div>
              <Skeleton height={24} width={180} />
              <Skeleton height={36} />
              <Skeleton height={36} />
            </div>
          ))}
        </div>
      )}

      {!loading && filteredQuizzes.length === 0 && !quizzesState.error && (
        <EmptyState
          icon={<HelpCircle size={28} className="text-slate-400" />}
          title="Belum ada ujian yang tersedia"
          description={
            search
              ? "Tidak ada ujian yang cocok dengan kata kunci pencarian Anda."
              : statusFilter !== "ALL"
                ? "Tidak ada ujian pada kategori status yang dipilih."
                : "Belum ada kuis atau ujian aktif yang dijadwalkan saat ini."
          }
        />
      )}

      {!loading && filteredQuizzes.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
