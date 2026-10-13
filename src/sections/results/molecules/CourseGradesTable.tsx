"use client";

import { Eye, User } from "lucide-react";
import type { UserGradeReportResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import GradeStatusBadge from "@/sections/results/atoms/GradeStatusBadge";
import ResultsEmptyState from "@/sections/results/atoms/ResultsEmptyState";
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
        wrapperClassName="border-slate-200  bg-white  shadow-sm"
        className="text-slate-700 "
      >
        <TableHead className="h-12 border-b border-slate-200  bg-slate-50  text-xs font-semibold uppercase text-slate-600 ">
          <TableRow className="border-b-0 hover:bg-transparent even:bg-transparent">
            <TableHeaderCell className="text-slate-600 ">
              Peserta
            </TableHeaderCell>
            <TableHeaderCell className="text-slate-600 ">
              ID Siswa
            </TableHeaderCell>
            <TableHeaderCell className="text-center text-slate-600 ">
              Komponen Selesai
            </TableHeaderCell>
            <TableHeaderCell className="text-right text-slate-600 ">
              Nilai Total
            </TableHeaderCell>
            <TableHeaderCell className="text-center text-slate-600 ">
              Status
            </TableHeaderCell>
            {onSelectStudent && (
              <TableHeaderCell className="text-center text-slate-600 ">
                Aksi
              </TableHeaderCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody className="divide-y divide-slate-200 ">
          {reports.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={onSelectStudent ? 6 : 5}
                className="py-8 text-center"
              >
                <ResultsEmptyState
                  title="Belum ada rekap nilai peserta yang tersedia"
                  description="Data rekapitulasi nilai untuk mata pelajaran ini belum tersedia atau peserta belum dinilai."
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
                  className="border-slate-200  hover:bg-slate-50  even:bg-slate-50/50  transition-colors"
                >
                  <TableCell className="text-slate-800 ">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100  text-slate-500 ">
                        <User size={15} />
                      </div>
                      <span className="font-medium text-slate-900 ">
                        {report.userFullName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 ">
                    #{report.userId}
                  </TableCell>
                  <TableCell className="text-center text-slate-600 ">
                    {completedCount} / {report.items.length}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 ">
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
