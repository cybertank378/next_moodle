"use client";

import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  ShieldAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppRouteConstants } from "@/libs/routes";
import { stripHtml } from "@/libs/utils";
import { useQuizApi } from "@/modules/quiz/presentation/hooks/useQuizApi";
import { useQuizAttemptApi } from "@/modules/quiz-attempts/presentation/hooks/useQuizAttemptApi";
import Button from "@/shared-ui/component/Button";
import Skeleton from "@/shared-ui/component/Skeleton";
import QuizStatusBadge from "../atoms/QuizStatusBadge";

interface Props {
  quizId: number;
}

export default function QuizDetailView({ quizId }: Props) {
  const router = useRouter();
  const { detailState, accessState, getQuizDetail, checkQuizAccess } =
    useQuizApi();
  const { startState, startAttempt } = useQuizAttemptApi();

  useEffect(() => {
    if (quizId) {
      void getQuizDetail(quizId);
      void checkQuizAccess(quizId);
    }
  }, [quizId, getQuizDetail, checkQuizAccess]);

  const quiz = detailState.data;
  const access = accessState.data;
  const loading = detailState.loading || accessState.loading;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          color="secondary"
          iconOnly
          leftIcon={ArrowLeft}
          onClick={() => router.push(AppRouteConstants.EXAMS)}
          aria-label="Kembali ke daftar ujian"
        />
        <div>
          <h1 className="text-2xl font-bold text-white">
            Detail & Akses Ujian
          </h1>
          <p className="text-sm text-gray-400">
            Periksa jadwal, durasi pengerjaan, dan status validasi akses ujian.
          </p>
        </div>
      </div>

      {detailState.error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
          {detailState.error}
        </div>
      )}

      {loading && !quiz && (
        <div className="rounded-xl border border-slate-800 bg-[#151521] p-6 space-y-4">
          <Skeleton height={28} width={260} />
          <Skeleton height={20} width={180} />
          <Skeleton height={80} />
          <Skeleton height={44} />
        </div>
      )}

      {quiz && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-slate-800 bg-[#151521] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <HelpCircle size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {quiz.name}
                    </h2>
                    <p className="text-xs text-slate-400">
                      ID Kuis: {quiz.id} • Modul Kursus: {quiz.courseModuleId}
                    </p>
                  </div>
                </div>
                <QuizStatusBadge status={quiz.status} />
              </div>

              {quiz.intro && (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Petunjuk Pengerjaan
                  </h4>
                  <div className="rounded-lg border border-slate-800/60 bg-slate-900/50 p-4 text-xs text-slate-300 leading-relaxed">
                    {stripHtml(quiz.intro)}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                <div className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-3.5 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} className="text-indigo-400" />
                    <span>Batas Waktu Pengerjaan</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {quiz.timeLimitSeconds > 0
                      ? `${Math.round(quiz.timeLimitSeconds / 60)} Menit`
                      : "Tanpa Batas Waktu"}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-3.5 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={14} className="text-amber-400" />
                    <span>Maksimal Percobaan</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {quiz.maxAttempts > 0
                      ? `${quiz.maxAttempts} Kali Percobaan`
                      : "Tak Terbatas"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-[#151521] p-6 space-y-5 shadow-sm">
              <h3 className="text-base font-bold text-white border-b border-slate-800/80 pb-3">
                Validasi Akses Ujian
              </h3>

              {accessState.loading && (
                <div className="space-y-3">
                  <Skeleton height={24} width={140} />
                  <Skeleton height={60} />
                  <Skeleton height={42} />
                </div>
              )}

              {!accessState.loading && access && (
                <div className="space-y-4">
                  {access.canAttempt ? (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 space-y-2 text-emerald-400">
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <CheckCircle2 size={18} />
                        <span>Akses Diizinkan</span>
                      </div>
                      <p className="text-xs text-emerald-300/80 leading-relaxed">
                        Anda memenuhi seluruh syarat untuk memulai ujian ini.
                        Pastikan koneksi internet stabil sebelum menekan tombol
                        mulai.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 space-y-2 text-rose-400">
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <ShieldAlert size={18} />
                        <span>Akses Tidak Tersedia</span>
                      </div>
                      <ul className="text-xs text-rose-300/80 space-y-1 list-disc pl-4">
                        {access.reasons.map((reason) => (
                          <li key={reason}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {startState.error && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400">
                      {startState.error}
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      size="md"
                      color="warning"
                      variant="filled"
                      fullWidth
                      leftIcon={Play}
                      disabled={!access.canAttempt || startState.loading}
                      loading={startState.loading}
                      onClick={async () => {
                        const res = await startAttempt({ quizId: quiz.id });
                        if (res.data) {
                          router.push(
                            AppRouteConstants.examAttempt(quiz.id, res.data.id),
                          );
                        }
                      }}
                    >
                      {startState.loading
                        ? "Menyiapkan Ujian..."
                        : access.canAttempt
                          ? "Mulai Ujian Sekarang"
                          : "Ujian Tidak Dapat Diakses"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-slate-900/60 p-3.5 text-[11px] text-slate-400 space-y-1.5 border border-slate-800/40">
                <div className="flex items-center gap-1.5 font-medium text-slate-300">
                  <AlertCircle size={13} className="text-indigo-400" />
                  <span>Catatan Integritas Ujian</span>
                </div>
                <p>
                  Sesi ujian ini diawasi oleh sistem verifikasi anti cheat
                  engine. Segala bentuk perpindahan jendela browser dapat
                  tercatat pada audit log.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
