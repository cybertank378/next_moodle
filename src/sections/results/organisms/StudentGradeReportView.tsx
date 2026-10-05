"use client";

import { Award, BookOpen, CheckCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useGradeApi } from "@/modules/grades/presentation/hooks/useGradeApi";
import Button from "@/shared-ui/component/Button";
import Pagination from "@/shared-ui/component/Pagination";
import Skeleton from "@/shared-ui/component/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/shared-ui/component/Table";
import GradeScoreCard from "@/sections/results/atoms/GradeScoreCard";
import GradeStatusBadge from "@/sections/results/atoms/GradeStatusBadge";
import ResultsEmptyState from "@/sections/results/atoms/ResultsEmptyState";
import GradeReportSummaryCard from "@/sections/results/molecules/GradeReportSummaryCard";

export interface StudentGradeReportViewProps {
  courseId: number;
  userId?: number;
  courseTitle?: string;
  onBack?: () => void;
}

const ITEMS_PER_PAGE = 10;

export default function StudentGradeReportView({
  courseId,
  userId,
  courseTitle,
  onBack,
}: StudentGradeReportViewProps) {
  const { userReportState, getUserGradeReport } = useGradeApi();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (courseId) {
      void getUserGradeReport(courseId, userId);
    }
  }, [courseId, userId, getUserGradeReport]);

  const report = userReportState.data;
  const loading = userReportState.loading;
  const error = userReportState.error;

  const paginatedItems = useMemo(() => {
    if (!report?.items) return [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return report.items.slice(start, start + ITEMS_PER_PAGE);
  }, [report, currentPage]);

  return (
    <div data-testid="student-grade-report-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">
            Rapor & Hasil Ujian
          </h1>
          <p className="text-sm text-slate-500 ">
            Penarikan hasil penilaian ujian dan rekaman kelulusan materi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              size="sm"
              variant="outline"
              color="secondary"
              onClick={onBack}
            >
              Kembali
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            color="secondary"
            leftIcon={RefreshCw}
            loading={loading}
            onClick={() => void getUserGradeReport(courseId, userId)}
          >
            Muat Ulang
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
          <p className="font-semibold">Gagal memuat hasil penilaian:</p>
          <p className="mt-1 text-xs">{error}</p>
        </div>
      )}

      {loading && !report ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : report ? (
        <>
          <GradeReportSummaryCard report={report} courseTitle={courseTitle} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GradeScoreCard
              label="Komponen Penilaian"
              value={report.items.length}
              subLabel="Tugas / Kuis"
              icon={<BookOpen size={18} />}
              variant="primary"
            />
            <GradeScoreCard
              label="Komponen Lulus"
              value={report.items.filter((i) => i.isPassed === true).length}
              subLabel={`dari ${report.items.length} ujian`}
              icon={<CheckCircle size={18} />}
              variant="success"
            />
            <GradeScoreCard
              label="Skor Akhir Mata Pelajaran"
              value={
                report.courseTotal ? report.courseTotal.gradeFormatted : "-"
              }
              subLabel={
                report.courseTotal?.isPassed ? "Tuntas" : "Belum Tuntas"
              }
              icon={<Award size={18} />}
              variant={report.courseTotal?.isPassed ? "success" : "warning"}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 ">
              Daftar Komponen Nilai & Kuis
            </h3>

            <div className="space-y-4">
              <Table
                wrapperClassName="border-slate-200  bg-white  shadow-sm"
                className="text-slate-700 "
              >
                <TableHead className="h-12 border-b border-slate-200  bg-slate-50  text-xs font-semibold uppercase text-slate-600 ">
                  <TableRow className="border-b-0 hover:bg-transparent even:bg-transparent">
                    <TableHeaderCell className="text-slate-600 ">
                      Komponen Penilaian
                    </TableHeaderCell>
                    <TableHeaderCell className="text-slate-600 ">
                      Tipe
                    </TableHeaderCell>
                    <TableHeaderCell className="text-center text-slate-600 ">
                      Batas Lulus
                    </TableHeaderCell>
                    <TableHeaderCell className="text-right text-slate-600 ">
                      Nilai / Skor
                    </TableHeaderCell>
                    <TableHeaderCell className="text-center text-slate-600 ">
                      Status
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody className="divide-y divide-slate-200 ">
                  {report.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center">
                        <ResultsEmptyState
                          title="Belum ada aktivitas kuis atau materi yang dinilai"
                          description="Nilai belum diinput oleh pengajar untuk mata pelajaran ini."
                          onRetry={() =>
                            void getUserGradeReport(courseId, userId)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-slate-200  hover:bg-slate-50  even:bg-slate-50/50  transition-colors"
                      >
                        <TableCell className="text-slate-800 ">
                          <div>
                            <span className="font-medium text-slate-900 ">
                              {item.itemName}
                            </span>
                            {item.feedback && (
                              <p className="mt-0.5 text-xs italic text-sky-600 ">
                                Catatan: &ldquo;{item.feedback}&rdquo;
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs capitalize text-slate-500 ">
                          {item.itemModule || item.itemType}
                        </TableCell>
                        <TableCell className="text-center text-slate-500 ">
                          {item.gradePass !== null ? item.gradePass : "-"}
                        </TableCell>
                        <TableCell className="text-right font-bold text-slate-900 ">
                          <div className="flex items-baseline justify-end gap-1">
                            <span>{item.gradeFormatted}</span>
                            <span className="text-xs text-slate-500 ">
                              / {item.gradeMax}
                            </span>
                          </div>
                          {item.percentageFormatted && (
                            <p className="text-xs font-medium text-slate-500 ">
                              {item.percentageFormatted}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <GradeStatusBadge isPassed={item.isPassed} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {report.items.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={report.items.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChangeAction={setCurrentPage}
                />
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
