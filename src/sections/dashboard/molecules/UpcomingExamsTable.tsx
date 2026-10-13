"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROUTES } from "@/libs/routes";
import Badge from "@/shared-ui/component/Badge";
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
import Typography from "@/shared-ui/component/Typography";

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

export default function UpcomingExamsTable({
  exams,
  loading,
}: UpcomingExamsTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const handleNavigateToAllExams = () => {
    router.push(ROUTES.DASHBOARD.EXAMS);
  };

  const totalItems = exams.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExams = exams.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="px-6 py-5 border-b border-slate-200/60  flex justify-between items-center bg-white/70  rounded-t-lg backdrop-blur-md">
        <Typography variant="h2" className="text-slate-900 ">
          Ujian Mendatang
        </Typography>
        <Button
          onClick={handleNavigateToAllExams}
          variant="secondary"
          size="sm"
        >
          Lihat Semua
        </Button>
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
              <TableCell
                colSpan={4}
                className="py-8 text-center text-slate-500 "
              >
                Tidak ada data ujian.
              </TableCell>
            </TableRow>
          ) : (
            paginatedExams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell>
                  <div className="font-semibold text-slate-900 ">
                    {exam.name}
                  </div>
                  <div className="text-xs text-slate-500  mt-1">
                    Siswa terdaftar: {exam.enrolledCount ?? 0}
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 ">{exam.course}</TableCell>
                <TableCell className="text-slate-600 ">
                  <div>{exam.scheduledDate.split(", ")[0]}</div>
                  <div className="text-xs text-slate-400  mt-0.5">
                    Durasi: {exam.duration} menit
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    color={
                      exam.status === "upcoming"
                        ? "success"
                        : exam.status === "published"
                          ? "info"
                          : exam.status === "pending"
                            ? "warning"
                            : exam.status === "open"
                              ? "primary"
                              : "secondary"
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
        <div className="px-6 py-4 bg-white/70  border border-t-0 border-slate-200/60  rounded-b-lg">
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
