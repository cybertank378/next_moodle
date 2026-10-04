"use client";

import { useState } from "react";
import LinkButton from "@/shared-ui/component/LinkButton";
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
import Typography from "@/shared-ui/component/Typography";
import Badge from "@/shared-ui/component/Badge";

const ITEMS_PER_PAGE = 5;

export interface UpcomingExamData {
  id: string;
  name: string;
  course: string;
  scheduledDate: string;
  duration: number;
  status: string;
  enrolledCount?: number;
}

interface UpcomingExamsTableProps {
  exams: UpcomingExamData[];
  loading: boolean;
}

export default function UpcomingExamsTable({ exams, loading }: UpcomingExamsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = exams.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExams = exams.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="px-6 py-5 border-b border-slate-200/60 dark:border-slate-800 flex justify-between items-center bg-white/70 dark:bg-slate-900/70 rounded-t-lg backdrop-blur-md">
        <Typography variant="h2" className="text-slate-900 dark:text-white">
          Ujian Mendatang
        </Typography>
        <LinkButton href="/dashboard/exams" variant="secondary" className="text-xs px-3 py-1">
          Lihat Semua
        </LinkButton>
      </div>

      <Table wrapperClassName="rounded-none rounded-b-lg border-t-0">
        <TableHead>
          <tr>
            <TableHeaderCell>Nama Ujian</TableHeaderCell>
            <TableHeaderCell>Mata Pelajaran</TableHeaderCell>
            <TableHeaderCell>Tanggal Dijadwalkan</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={`sk-${i}`}>
                <TableCell colSpan={4}>
                  <Skeleton height={20} />
                </TableCell>
              </TableRow>
            ))
          ) : paginatedExams.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-slate-500 dark:text-slate-400">
                Tidak ada data ujian.
              </TableCell>
            </TableRow>
          ) : (
            paginatedExams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{exam.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Siswa terdaftar: {exam.enrolledCount ?? 0}
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300">
                  {exam.course}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300">
                  <div>{exam.scheduledDate.split(", ")[0]}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Durasi: {exam.duration} menit
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    color={
                      exam.status === "upcoming" ? "success" : 
                      exam.status === "published" ? "info" : 
                      exam.status === "pending" ? "warning" : 
                      exam.status === "open" ? "primary" : "secondary"
                    } 
                    variant="soft" 
                    className="capitalize"
                  >
                    {exam.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {!loading && totalItems > 0 && (
        <div className="px-6 py-4 bg-white/70 dark:bg-slate-900/70 border border-t-0 border-slate-200/60 dark:border-slate-800 rounded-b-lg">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChangeAction={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
