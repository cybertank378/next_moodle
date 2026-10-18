"use client";

import {
  ArrowLeft,
  CheckCircle2,
  FileQuestion,
  HelpCircle,
  Save,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { ROUTES } from "@/libs/routes";
import { useCourseApi } from "@/modules/course/presentation/hooks/useCourseApi";
import { useExamAdminApi } from "@/modules/exam/presentation/hooks/useExamAdminApi";
import type { QuestionCategory } from "@/modules/questions/domain/types/QuestionTypes";
import { useQuestionApi } from "@/modules/questions/presentation/hooks/useQuestionApi";
import { useQuizApi } from "@/modules/quiz/presentation/hooks/useQuizApi";
import ActivityConfigForm, {
  type ActivityFormData,
} from "@/sections/exam/molecules/ActivityConfigForm";
import ActivityTypeSelector, {
  type ActivityType,
} from "@/sections/exam/molecules/ActivityTypeSelector";
import AddRandomQuestionsModal from "@/sections/exam/molecules/AddRandomQuestionsModal";
import BankSoalPicker from "@/sections/exam/molecules/BankSoalPicker";
import { QuestionEditor } from "@/sections/questions/organisms/QuestionEditor";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import Skeleton from "@/shared-ui/component/Skeleton";
import { showErrorToast, showSuccessToast } from "@/shared-ui/component/Toast";
import Typography from "@/shared-ui/component/Typography";

interface CreateActivityOrganismProps {
  courseId: number;
  initialType?: ActivityType;
}

interface QuestionItem {
  id: number;
  categoryId: number;
  type: string;
  name: string;
  questionText?: string;
  defaultMark?: number;
}

export default function CreateActivityOrganism({
  courseId,
  initialType = "quiz",
}: CreateActivityOrganismProps) {
  const router = useRouter();

  // API hooks
  const { detailState, getCourseDetail } = useCourseApi();
  const { quizzesState, listQuizzes } = useQuizApi();
  const { getQuestions, getCategories } = useQuestionApi();
  const { addQuestionToQuiz, addRandomQuestions } = useExamAdminApi();

  // Form & Activity Type states
  const [activeType, setActiveType] = useState<ActivityType>(initialType);
  const [formData, setFormData] = useState<ActivityFormData>({
    title: "",
    description: "",
    timeLimitMinutes: 60,
    passingGrade: 75,
    contentBody: "",
    maxGrade: 100,
  });

  // Bank Soal states
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [selectedQType, setSelectedQType] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);

  // Modals
  const [isCreateQuestionModalOpen, setIsCreateQuestionModalOpen] =
    useState<boolean>(false);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState<boolean>(false);

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // 1. Load course details
  useEffect(() => {
    if (courseId > 0 && !detailState.data && !detailState.loading) {
      void getCourseDetail(courseId);
    }
  }, [courseId, detailState.data, detailState.loading, getCourseDetail]);

  // 2. Load quizzes in course for Target Quiz Selector
  useEffect(() => {
    if (courseId > 0 && !quizzesState.data && !quizzesState.loading) {
      void listQuizzes({ courseId });
    }
  }, [courseId, listQuizzes, quizzesState.data, quizzesState.loading]);

  // Pre-select first quiz if available and targetQuizId is not set
  useEffect(() => {
    if (quizzesState.data?.quizzes?.length && !formData.targetQuizId) {
      setFormData((prev) => ({
        ...prev,
        targetQuizId: quizzesState.data!.quizzes[0].id,
      }));
    }
  }, [quizzesState.data, formData.targetQuizId]);

  // 3. Load question categories
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      const res = await getCategories(1);
      if (isMounted && res.data) {
        setCategories(res.data);
      }
    }
    void loadCategories();
    return () => {
      isMounted = false;
    };
  }, [getCategories]);

  // 4. Fetch questions with filter
  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const res = await getQuestions({
        categoryId: selectedCategoryId,
        qtype: selectedQType,
        search: searchQuery || undefined,
        limit: 50,
      });

      if (res.data?.questions) {
        setQuestions(
          res.data.questions.map((q) => ({
            id: q.id,
            categoryId: q.categoryId,
            type: q.type,
            name: q.name,
            questionText: q.questionText,
            defaultMark: q.defaultMark,
          })),
        );
      } else {
        setQuestions([]);
      }
    } catch {
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  }, [getQuestions, selectedCategoryId, selectedQType, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchQuestions();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchQuestions]);

  // Question Selection Handlers
  const handleToggleSelectQuestion = (id: number) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    const allIds = questions.map((q) => q.id);
    setSelectedQuestionIds((prev) => Array.from(new Set([...prev, ...allIds])));
  };

  const handleDeselectAll = () => {
    const pageIds = new Set(questions.map((q) => q.id));
    setSelectedQuestionIds((prev) => prev.filter((id) => !pageIds.has(id)));
  };

  // Add Random Questions Modal Confirm
  const handleConfirmRandomQuestions = async (
    catId: number,
    count: number,
    includeSub: boolean,
  ) => {
    if (!formData.targetQuizId) {
      throw new Error(
        "Pilih kuis tujuan terlebih dahulu sebelum menambahkan soal acak.",
      );
    }

    const res = await addRandomQuestions(
      formData.targetQuizId,
      catId,
      count,
      includeSub,
    );

    if (res.error) {
      throw new Error(res.error);
    }

    showSuccessToast(`Berhasil menambahkan ${count} butir soal acak ke kuis.`);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (activeType === "quiz") {
      if (!formData.targetQuizId) {
        const msg = "Silakan pilih kuis tujuan untuk menautkan butir soal.";
        setSubmitError(msg);
        showErrorToast(msg);
        return;
      }

      if (selectedQuestionIds.length === 0) {
        const msg =
          "Pilih minimal 1 butir soal dari Bank Soal untuk ditambahkan ke kuis.";
        setSubmitError(msg);
        showErrorToast(msg);
        return;
      }

      setSubmitting(true);
      try {
        let addedCount = 0;
        for (const qid of selectedQuestionIds) {
          const res = await addQuestionToQuiz(formData.targetQuizId, qid);
          if (res.error) {
            throw new Error(
              `Gagal menautkan butir soal #${qid}: ${res.error}`,
            );
          }
          addedCount++;
        }

        const successMsg = `Berhasil menautkan ${addedCount} butir soal dari Bank Soal ke kuis pilihan!`;
        setSubmitSuccess(successMsg);
        showSuccessToast(successMsg);

        setTimeout(() => {
          router.push(
            `${ROUTES.DASHBOARD.COURSES}/${courseId}?tab=exams`,
          );
        }, 1200);
      } catch (err: any) {
        const msg = err?.message || "Gagal menyimpan aktivitas kuis.";
        setSubmitError(msg);
        showErrorToast(msg);
      } finally {
        setSubmitting(false);
      }
    } else if (activeType === "materi") {
      if (!formData.title.trim()) {
        const msg = "Judul materi pembelajaran wajib diisi.";
        setSubmitError(msg);
        showErrorToast(msg);
        return;
      }

      if (!formData.contentBody?.trim()) {
        const msg = "Isi konten materi pembelajaran wajib diisi.";
        setSubmitError(msg);
        showErrorToast(msg);
        return;
      }

      setSubmitting(true);
      try {
        const successMsg =
          "Draf materi pembelajaran berhasil disimpan! Konten tercatat dalam kurikulum mata pelajaran.";
        setSubmitSuccess(successMsg);
        showSuccessToast(successMsg);

        setTimeout(() => {
          router.push(
            `${ROUTES.DASHBOARD.COURSES}/${courseId}?tab=materi`,
          );
        }, 1200);
      } catch (err: any) {
        const msg = err?.message || "Gagal menyimpan materi.";
        setSubmitError(msg);
        showErrorToast(msg);
      } finally {
        setSubmitting(false);
      }
    } else if (activeType === "tugas") {
      if (!formData.title.trim()) {
        const msg = "Judul tugas mandiri wajib diisi.";
        setSubmitError(msg);
        showErrorToast(msg);
        return;
      }

      setSubmitting(true);
      try {
        const successMsg =
          "Konfigurasi tugas berhasil disimpan ke jadwal kurikulum mata pelajaran.";
        setSubmitSuccess(successMsg);
        showSuccessToast(successMsg);

        setTimeout(() => {
          router.push(
            `${ROUTES.DASHBOARD.COURSES}/${courseId}?tab=overview`,
          );
        }, 1200);
      } catch (err: any) {
        const msg = err?.message || "Gagal menyimpan tugas.";
        setSubmitError(msg);
        showErrorToast(msg);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const courseTitle =
    detailState.data?.course.fullName ||
    (courseId > 0 ? `Mata Pelajaran #${courseId}` : "Mata Pelajaran");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={() =>
              router.push(`${ROUTES.DASHBOARD.COURSES}/${courseId}`)
            }
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Detail Mata Pelajaran
          </button>
          <Typography variant="h2" className="text-xl font-bold text-slate-900">
            Tambah Aktivitas Pembelajaran
          </Typography>
          <p className="text-xs text-slate-500 mt-0.5">
            Mata Pelajaran:{" "}
            <span className="font-semibold text-slate-700">{courseTitle}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`${ROUTES.DASHBOARD.COURSES}/${courseId}`)
            }
            disabled={submitting}
          >
            Batal
          </Button>
          <Button
            type="button"
            color="primary"
            size="sm"
            leftIcon={Save}
            onClick={handleSubmit}
            loading={submitting}
            disabled={submitting}
            className="shadow-xs"
          >
            Simpan Aktivitas
          </Button>
        </div>
      </div>

      {/* Course Loading State */}
      {detailState.loading && (
        <Card className="p-4 space-y-2">
          <Skeleton height={18} width="35%" />
          <Skeleton height={14} width="60%" />
        </Card>
      )}

      {/* Success Alert */}
      {submitSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">{submitSuccess}</p>
        </div>
      )}

      {/* Error Alert */}
      {submitError && (
        <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <HelpCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-xs font-semibold">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Activity Type Selection */}
        <Card className="p-5 shadow-xs border-slate-200">
          <ActivityTypeSelector
            activeType={activeType}
            onChange={(type) => {
              setActiveType(type);
              setSubmitError(null);
            }}
            disabled={submitting}
          />
        </Card>

        {/* Step 2: Activity Form Configuration */}
        <Card className="p-5 shadow-xs border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Konfigurasi {activeType === "quiz" ? "Kuis & Evaluasi" : activeType === "materi" ? "Materi Pembelajaran" : "Tugas Mandiri"}
              </h3>
              <p className="text-xs text-slate-500">
                Isi parameter dan informasi utama aktivitas pembelajaran
              </p>
            </div>
            <span className="text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {activeType}
            </span>
          </div>

          <ActivityConfigForm
            activityType={activeType}
            formData={formData}
            targetQuizzes={quizzesState.data?.quizzes || []}
            onChange={(field, value) =>
              setFormData((prev) => ({ ...prev, [field]: value }))
            }
            disabled={submitting}
          />
        </Card>

        {/* Step 3: Bank Soal Picker (Active only when Quiz is selected) */}
        {activeType === "quiz" && (
          <Card className="p-5 shadow-xs border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-indigo-600" /> Komposisi Soal Kuis
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih butir soal dari Bank Soal Moodle untuk kuis ini
                </p>
              </div>
            </div>

            <BankSoalPicker
              questions={questions}
              categories={categories}
              selectedQuestionIds={selectedQuestionIds}
              selectedCategoryId={selectedCategoryId}
              selectedQType={selectedQType}
              searchQuery={searchQuery}
              loading={loadingQuestions}
              onCategoryChange={setSelectedCategoryId}
              onQTypeChange={setSelectedQType}
              onSearchChange={setSearchQuery}
              onToggleSelect={handleToggleSelectQuestion}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onOpenCreateQuestionModal={() =>
                setIsCreateQuestionModalOpen(true)
              }
              onOpenRandomModal={() => setIsRandomModalOpen(true)}
              disabled={submitting}
            />
          </Card>
        )}

        {/* Bottom Action Footer */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-500">
            {activeType === "quiz" && (
              <span>
                {selectedQuestionIds.length} butir soal dipilih untuk ditautkan
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(`${ROUTES.DASHBOARD.COURSES}/${courseId}`)
              }
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              color="primary"
              size="sm"
              leftIcon={Save}
              loading={submitting}
              disabled={submitting}
              className="shadow-xs"
            >
              Simpan Aktivitas
            </Button>
          </div>
        </div>
      </form>

      {/* Modal: Create Question Inline in Bank Soal */}
      {isCreateQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Buat Butir Soal Baru di Bank Soal
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateQuestionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              <QuestionEditor
                categoryId={selectedCategoryId || categories[0]?.id || 1}
                onSuccess={() => {
                  setIsCreateQuestionModalOpen(false);
                  showSuccessToast(
                    "Soal baru berhasil dibuat dan disimpan di Bank Soal Moodle!",
                  );
                  void fetchQuestions();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Random Questions */}
      <AddRandomQuestionsModal
        isOpen={isRandomModalOpen}
        onClose={() => setIsRandomModalOpen(false)}
        categories={categories}
        onConfirm={handleConfirmRandomQuestions}
      />
    </div>
  );
}
