"use client";

import { HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuizApi } from "@/modules/quiz/presentation/hooks/useQuizApi";
import Skeleton from "@/shared-ui/component/Skeleton";
import QuizCard from "@/sections/exam/molecules/QuizCard";
import QuizFilterBar from "@/sections/exam/molecules/QuizFilterBar";

interface Props {
  courseId?: number;
}

export default function QuizListView({ courseId }: Props) {
  const { quizzesState, listQuizzes } = useQuizApi();
  const [search, setSearch] = useState("");

  useEffect(() => {
    void listQuizzes({ courseId, search });
  }, [courseId, listQuizzes, search]);

  const quizzes = quizzesState.data?.quizzes ?? [];
  const loading = quizzesState.loading;

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

      <QuizFilterBar search={search} onSearchChange={setSearch} />

      {quizzesState.error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
          {quizzesState.error}
        </div>
      )}

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

      {!loading && quizzes.length === 0 && !quizzesState.error && (
        <div className="rounded-xl border border-slate-200  bg-white  p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100  text-slate-500 ">
            <HelpCircle size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900 ">
            Belum ada ujian yang tersedia
          </h3>
          <p className="mt-1 text-xs text-slate-500  max-w-sm mx-auto">
            {search
              ? "Tidak ada ujian yang cocok dengan kata kunci pencarian Anda."
              : "Belum ada kuis atau ujian aktif yang dijadwalkan saat ini."}
          </p>
        </div>
      )}

      {!loading && quizzes.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
