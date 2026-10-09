"use client";

import { useState } from "react";
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
import Button from "@/shared-ui/component/Button";
import { showErrorToast } from "@/shared-ui/component/Toast";
import type { ExamMonitorParticipantDto } from "@/modules/exam-monitor/domain/dto/ExamMonitorDto";
import { useExamMonitorApi } from "@/modules/exam-monitor/presentation/hooks/useExamMonitorApi";

const ITEMS_PER_PAGE = 10;

interface ActiveParticipantsTableProps {
  quizId: number;
  participants: ExamMonitorParticipantDto[];
  loading: boolean;
}

export default function ActiveParticipantsTable({ quizId, participants, loading }: ActiveParticipantsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    isMutating,
    lockAttempt,
    unlockAttempt,
    forceFinishAttempt,
    extendTimeAttempt,
    fetchMonitor,
  } = useExamMonitorApi();

  const totalItems = participants.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedParticipants = participants.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatState = (state: string) => {
    switch (state) {
      case "inprogress":
        return <Badge color="primary" variant="soft">Sedang Berjalan</Badge>;
      case "finished":
        return <Badge color="success" variant="soft">Selesai</Badge>;
      case "abandoned":
        return <Badge color="error" variant="soft">Ditinggalkan</Badge>;
      case "overdue":
        return <Badge color="warning" variant="soft">Terlambat</Badge>;
      default:
        return <Badge color="secondary" variant="soft">{state}</Badge>;
    }
  };

  const handleAction = async (action: () => Promise<void>) => {
    try {
      await action();
      await fetchMonitor(quizId);
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Terjadi kesalahan");
    }
  };

  const handleUnlock = (attemptId: number) => {
    void handleAction(() => unlockAttempt({ attemptId }));
  };

  const handleLock = (attemptId: number) => {
    void handleAction(() => lockAttempt({ attemptId }));
  };

  const handleExtendTime = (attemptId: number) => {
    void handleAction(() => extendTimeAttempt({ attemptId, extraTimeMinutes: 10 }));
  };

  const handleForceFinish = (attemptId: number) => {
    if (confirm("Anda yakin ingin memaksa selesai ujian ini?")) {
      void handleAction(() => forceFinishAttempt({ attemptId }));
    }
  };

  return (
    <div className="w-full">
      <div className="px-6 py-5 border-b border-slate-200/60  flex justify-between items-center bg-white/70  rounded-t-lg backdrop-blur-md">
        <Typography variant="h2" className="text-slate-900 ">
          Daftar Kandidat
        </Typography>
      </div>

      <div className="overflow-x-auto">
        <Table wrapperClassName="rounded-none rounded-b-lg border-t-0 min-w-[800px]">
          <TableHead>
            <tr>
              <TableHeaderCell>Kandidat</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Sisa Waktu</TableHeaderCell>
              <TableHeaderCell>Aksi</TableHeaderCell>
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
            ) : paginatedParticipants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-slate-500 ">
                  Belum ada kandidat.
                </TableCell>
              </TableRow>
            ) : (
              paginatedParticipants.map((p) => (
                <TableRow key={p.attemptId}>
                  <TableCell>
                    <div className="font-semibold text-slate-900 ">{p.fullname}</div>
                    <div className="text-xs text-slate-500  mt-1">
                      Attempt ID: {p.attemptId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {formatState(p.state)}
                      {p.isLocked && (
                         <Badge color="error" variant="soft">Terkunci</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-600 ">
                    {p.timeRemaining !== undefined ? `${Math.floor(p.timeRemaining / 60)}m ${p.timeRemaining % 60}s` : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {p.isLocked ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          color="primary"
                          disabled={isMutating}
                          onClick={() => handleUnlock(p.attemptId)}
                        >
                          Buka Kunci
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          color="danger"
                          disabled={isMutating || p.state === "finished"}
                          onClick={() => handleLock(p.attemptId)}
                        >
                          Kunci
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        color="secondary"
                        disabled={isMutating || p.state === "finished"}
                        onClick={() => handleExtendTime(p.attemptId)}
                      >
                        +10m
                      </Button>
                      <Button 
                        variant="filled" 
                        size="sm" 
                        color="danger"
                        disabled={isMutating || p.state === "finished"}
                        onClick={() => handleForceFinish(p.attemptId)}
                      >
                        Selesaikan
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
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
