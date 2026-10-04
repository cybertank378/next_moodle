"use client";

import { Eye, User } from "lucide-react";
import type { UserGradeReportResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import Button from "@/shared-ui/component/Button";
import Pagination from "@/shared-ui/component/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/shared-ui/component/Table";
import GradeStatusBadge from "@/sections/results/atoms/GradeStatusBadge";
import ResultsEmptyState from "@/sections/results/atoms/ResultsEmptyState";

export interface CourseGradesTableProps {
  reports: UserGradeReportResponseDto[];
  onSelectStudent?: (report: UserGradeReportResponseDto) => void;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
  className?: string;
}

export default function CourseGradesTable({
  reports,
  onSelectStudent,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onRetry,
  className = "",
}: CourseGradesTableProps) {
  return (
    <div data-testid="course-grades-table" className={`space-y-4 ${className}`}>
      <Table
        wrapperClassName="border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 shadow-sm"
        className="text-slate-700 dark:text-gray-200"
      >
        <TableHead className="h-12 border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/80 text-xs font-semibold uppercase text-slate-600 dark:text-gray-400">
          <TableRow className="border-b-0 hover:bg-transparent even:bg-transparent">
            <TableHeaderCell className="text-slate-600 dark:text-gray-400">
              Peserta
            </TableHeaderCell>
            <TableHeaderCell className="text-slate-600 dark:text-gray-400">
              ID Siswa
            </TableHeaderCell>
            <TableHeaderCell className="text-center text-slate-600 dark:text-gray-400">
              Komponen Selesai
            </TableHeaderCell>
            <TableHeaderCell className="text-right text-slate-600 dark:text-gray-400">
              Nilai Total
            </TableHeaderCell>
            <TableHeaderCell className="text-center text-slate-600 dark:text-gray-400">
              Status
            </TableHeaderCell>
            {onSelectStudent && (
              <TableHeaderCell className="text-center text-slate-600 dark:text-gray-400">
                Aksi
              </TableHeaderCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody className="divide-y divide-slate-200 dark:divide-gray-800/60">
          {reports.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={onSelectStudent ? 6 : 5}
                className="py-8 text-center"
              >
                <ResultsEmptyState
                  title="Belum ada rekap nilai peserta yang tersedia"
                  description="Data rekapitulasi nilai untuk kursus ini belum tersedia atau peserta belum dinilai."
                  onRetry={onRetry}
                />
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => {
              const total = report.courseTotal;
              const completedCount = report.items.filter(
                (i) => i.gradeRaw !== null,
              ).length;

              return (
                <TableRow
                  key={report.userId}
                  className="border-slate-200 dark:border-gray-800/60 hover:bg-slate-50 dark:hover:bg-gray-800/40 even:bg-slate-50/50 dark:even:bg-gray-900/30 transition-colors"
                >
                  <TableCell className="text-slate-800 dark:text-gray-200">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400">
                        <User size={15} />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {report.userFullName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-gray-400">
                    #{report.userId}
                  </TableCell>
                  <TableCell className="text-center text-slate-600 dark:text-gray-300">
                    {completedCount} / {report.items.length}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                    {total ? total.gradeFormatted : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <GradeStatusBadge
                      isPassed={total ? total.isPassed : null}
                    />
                  </TableCell>
                  {onSelectStudent && (
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        color="secondary"
                        leftIcon={Eye}
                        onClick={() => onSelectStudent(report)}
                        aria-label={`Lihat rapor ${report.userFullName}`}
                      >
                        Rapor
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {currentPage !== undefined &&
        totalItems !== undefined &&
        itemsPerPage !== undefined &&
        onPageChange !== undefined &&
        totalItems > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChangeAction={onPageChange}
          />
        )}
    </div>
  );
}
