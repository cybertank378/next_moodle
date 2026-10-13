"use client";

import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileQuestion,
  FileText,
  HelpCircle,
  Info,
  Layers,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES } from "@/libs/routes";
import { sanitizeHtml } from "@/libs/utils";
import type {
  CourseModuleResponseDTO,
  CourseSectionResponseDTO,
} from "@/modules/course/domain/dto/CourseResponseDto";
import { useCourseApi } from "@/modules/course/presentation/hooks/useCourseApi";
import { useGradeApi } from "@/modules/grades/presentation/hooks/useGradeApi";
import { useQuizApi } from "@/modules/quiz/presentation/hooks/useQuizApi";
import CourseProgressBadge from "@/sections/courses/atoms/CourseProgressBadge";
import Badge from "@/shared-ui/component/Badge";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import EmptyState from "@/shared-ui/component/EmptyState";
import Skeleton from "@/shared-ui/component/Skeleton";
import { showErrorToast } from "@/shared-ui/component/Toast";
import Typography from "@/shared-ui/component/Typography";

interface CourseDetailViewProps {
  courseId: number;
}

type CourseTab = "overview" | "materi" | "tugas" | "ujian" | "forum" | "nilai";

export default function CourseDetailView({ courseId }: CourseDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CourseTab>("overview");

  const { detailState, getCourseDetail } = useCourseApi();
  const { quizzesState, listQuizzes } = useQuizApi();
  const { userReportState, getUserGradeReport } = useGradeApi();

  const handleNavigateToCourses = () => {
    router.push(ROUTES.STUDENT.COURSES);
  };

  useEffect(() => {
    if (courseId > 0) {
      void getCourseDetail(courseId);
    }
  }, [courseId, getCourseDetail]);

  useEffect(() => {
    if (activeTab === "ujian" && courseId > 0 && !quizzesState.data && !quizzesState.loading) {
      void listQuizzes({ courseId });
    }
  }, [activeTab, courseId, listQuizzes, quizzesState.data, quizzesState.loading]);

  useEffect(() => {
    if (activeTab === "nilai" && courseId > 0 && !userReportState.data && !userReportState.loading) {
      void getUserGradeReport(courseId, undefined, { silent: true });
    }
  }, [activeTab, courseId, getUserGradeReport, userReportState.data, userReportState.loading]);

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
    <div className="space-y-6 max-w-[1400px] mx-auto pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back button and title */}
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
          <Typography variant="caption" className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Mata Pelajaran
          </Typography>
          <Typography variant="h1" className="text-xl sm:text-2xl font-bold text-slate-900">
            {loading ? <Skeleton width={240} height={28} /> : course?.displayName || "Detail Mata Pelajaran"}
          </Typography>
        </div>
      </div>

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
          {/* Header Card / Hero */}
          <Card className="p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge color="primary" variant="soft">
                    {course.shortName}
                  </Badge>
                  <CourseProgressBadge
                    progress={course.progress}
                    isCompleted={course.isCompleted}
                  />
                  {course.format && (
                    <Badge color="secondary" variant="outline">
                      Format: {course.format}
                    </Badge>
                  )}
                </div>

                <Typography variant="h1" className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {course.fullName}
                </Typography>

                {course.summary ? (
                  <div
                    className="prose text-sm text-slate-600 max-w-none line-clamp-3 leading-relaxed"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized Moodle summary
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(course.summary),
                    }}
                  />
                ) : (
                  <p className="text-sm text-slate-400 italic">
                    Belum ada deskripsi singkat untuk mata pelajaran ini.
                  </p>
                )}
              </div>

              {/* Progress Summary Card */}
              <div className="w-full md:w-64 shrink-0 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500">
                    Kemajuan Belajar
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {course.progress !== null && course.progress !== undefined
                      ? `${Math.round(course.progress)}%`
                      : "—"}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  {course.progress !== null && course.progress !== undefined && (
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, Math.round(course.progress)))}%`,
                      }}
                    />
                  )}
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
                  <span>Total Topik: {sections.length}</span>
                  <span>Modul: {totalModules}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Tab Navigation */}
          <div className="border-b border-slate-200 flex gap-2 overflow-x-auto no-scrollbar pt-2">
            {[
              { id: "overview", label: "Overview", icon: BookOpen },
              { id: "materi", label: "Materi", icon: Layers },
              { id: "ujian", label: "Ujian", icon: FileQuestion },
              { id: "nilai", label: "Nilai", icon: Award },
              { id: "tugas", label: "Tugas", icon: FileText, blocked: true },
              { id: "forum", label: "Forum", icon: MessageSquare, blocked: true },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as CourseTab)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.blocked && (
                    <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-normal">
                      Segera
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 space-y-4 border border-slate-200/80 shadow-xs">
                  <Typography variant="h3" className="font-bold text-slate-900 flex items-center gap-2">
                    <Info size={18} className="text-blue-600" />
                    Tentang Mata Pelajaran
                  </Typography>
                  {course.summary ? (
                    <div
                      className="prose text-sm text-slate-700 leading-relaxed max-w-none"
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized Moodle summary
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(course.summary),
                      }}
                    />
                  ) : (
                    <p className="text-sm text-slate-500">
                      Tidak ada informasi deskripsi tambahan yang disediakan.
                    </p>
                  )}
                </Card>

                <Card className="p-6 space-y-4 border border-slate-200/80 shadow-xs">
                  <Typography variant="h3" className="font-bold text-slate-900 flex items-center gap-2">
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
                        <div
                          key={section.id}
                          className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                              {sIdx + 1}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {section.name || `Topik ${section.sectionNumber}`}
                              </p>
                              <span className="text-xs text-slate-500">
                                {section.modules.length} modul aktivitas
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="secondary"
                            onClick={() => setActiveTab("materi")}
                          >
                            Buka Materi
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <Card className="p-6 space-y-4 border border-slate-200/80 shadow-xs">
                  <Typography variant="h3" className="font-bold text-slate-900">
                    Informasi Pembelajaran
                  </Typography>
                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-400">Kode Mata Pelajaran</span>
                      <span className="font-semibold text-slate-800">{course.shortName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-400">Status Belajar</span>
                      <span className="font-semibold text-slate-800">
                        {course.isCompleted ? "Telah Selesai" : "Sedang Berlangsung"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-400">Format Pembelajaran</span>
                      <span className="font-semibold text-slate-800 capitalize">{course.format}</span>
                    </div>
                    {course.startDate && (
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-400">Tanggal Mulai</span>
                        <span className="font-semibold text-slate-800">
                          {new Date(course.startDate * 1000).toLocaleDateString("id-ID", {
                            dateStyle: "medium",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: MATERI */}
          {activeTab === "materi" && (
            <div className="space-y-4">
              {sections.length === 0 ? (
                <EmptyState
                  title="Belum Ada Konten Pembelajaran"
                  description="Topik dan materi pembelajaran belum ditambahkan oleh guru pengampu pada sistem Moodle."
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
                      <Typography variant="h3" className="text-base font-bold text-slate-900">
                        {section.name || `Topik ${section.sectionNumber}`}
                      </Typography>
                    </div>

                    {section.summary && (
                      <div
                        className="prose text-xs text-slate-600 max-w-none line-clamp-3 leading-relaxed"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized Moodle summary
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(section.summary),
                        }}
                      />
                    )}

                    {section.modules.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        Tidak ada modul pembelajaran pada topik ini.
                      </p>
                    ) : (
                      <div className="space-y-2.5 pt-1">
                        {section.modules.map((mod: CourseModuleResponseDTO) => {
                          const isQuiz = mod.modName.toLowerCase() === "quiz";
                          return (
                            <div
                              key={mod.id}
                              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3.5 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                    isQuiz
                                      ? "bg-amber-100 text-amber-600"
                                      : "bg-blue-100 text-blue-600"
                                  }`}
                                >
                                  {isQuiz ? (
                                    <HelpCircle size={18} />
                                  ) : (
                                    <FileText size={18} />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-slate-900 truncate">
                                    {mod.name}
                                  </p>
                                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                    {mod.modName}
                                  </span>
                                </div>
                              </div>

                              {isQuiz && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  color="warning"
                                  leftIcon={CheckCircle2}
                                  onClick={() => setActiveTab("ujian")}
                                >
                                  Ikuti Ujian
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}

          {/* TAB 3: UJIAN */}
          {activeTab === "ujian" && (
            <div className="space-y-4">
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
                (!quizzesState.data?.quizzes || quizzesState.data.quizzes.length === 0) && (
                  <EmptyState
                    title="Tidak Ada Ujian Aktif"
                    description="Belum ada ujian atau kuis yang dijadwalkan untuk mata pelajaran ini."
                    icon={<FileQuestion className="w-6 h-6 text-slate-400" />}
                  />
                )}

              {!quizzesState.loading &&
                !quizzesState.error &&
                quizzesState.data?.quizzes &&
                quizzesState.data.quizzes.length > 0 && (
                  <div className="space-y-3">
                    {quizzesState.data.quizzes.map((quiz) => (
                      <Card
                        key={quiz.id}
                        className="p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 min-w-0">
                          <Typography variant="h3" className="text-base font-bold text-slate-900 truncate">
                            {quiz.name}
                          </Typography>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                            {quiz.timeLimitSeconds ? (
                              <span className="flex items-center gap-1">
                                <Clock size={14} className="text-slate-400" />
                                Durasi: {Math.floor(quiz.timeLimitSeconds / 60)} menit
                              </span>
                            ) : (
                              <span>Durasi: Bebas</span>
                            )}
                            {quiz.timeOpen ? (
                              <span className="flex items-center gap-1">
                                <Calendar size={14} className="text-slate-400" />
                                Dibuka: {new Date(quiz.timeOpen * 1000).toLocaleString("id-ID", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          color="primary"
                          onClick={() => router.push(ROUTES.STUDENT.EXAMS)}
                        >
                          Masuk ke Sesi Ujian
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* TAB 4: NILAI */}
          {activeTab === "nilai" && (
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
                (!userReportState.data?.items || userReportState.data.items.length === 0) && (
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
                      <Card className="p-5 border-blue-200 bg-blue-50/50 shadow-xs flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            Total Nilai Mata Pelajaran
                          </p>
                          <Typography variant="h3" className="text-lg font-extrabold text-slate-900 mt-0.5">
                            {userReportState.data.courseTotal.itemName || "Nilai Akhir"}
                          </Typography>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-blue-700">
                            {userReportState.data.courseTotal.gradeFormatted || "—"}
                          </span>
                          {userReportState.data.courseTotal.percentageFormatted && (
                            <p className="text-xs text-slate-500">
                              ({userReportState.data.courseTotal.percentageFormatted})
                            </p>
                          )}
                        </div>
                      </Card>
                    )}

                    <div className="space-y-2">
                      {userReportState.data.items
                        .filter((item) => item.itemType !== "course")
                        .map((item) => (
                          <Card
                            key={item.id}
                            className="p-4 border border-slate-200/80 shadow-xs flex justify-between items-center"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {item.itemName || "Aktivitas"}
                              </p>
                              <span className="text-xs text-slate-400">
                                Rentang: {item.gradeMin} - {item.gradeMax}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-bold text-slate-800">
                                {item.gradeFormatted || "—"}
                              </span>
                              {item.percentageFormatted && (
                                <p className="text-xs text-slate-400">
                                  {item.percentageFormatted}
                                </p>
                              )}
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* TAB 5 & 6: TUGAS & FORUM (FEATURE-GATED & HONEST STATE) */}
          {(activeTab === "tugas" || activeTab === "forum") && (
            <Card className="p-8 sm:p-12 text-center border-dashed border-2 border-slate-200 bg-slate-50/60 rounded-3xl space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60">
                <AlertCircle size={28} />
              </div>
              <Typography variant="h3" className="text-base font-bold text-slate-800">
                Fitur {activeTab === "tugas" ? "Tugas (Assignment)" : "Forum Diskusi"} Belum Tersedia
              </Typography>
              <Typography variant="body" className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Layanan Moodle API (plugin local_examapi) untuk akses siswa terhadap modul{" "}
                {activeTab === "tugas" ? "mod_assign" : "mod_forum"} saat ini belum terdaftar pada
                kontrak backend resmi. Antarmuka ini tidak menampilkan data rekaan demi integritas akademik.
              </Typography>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
