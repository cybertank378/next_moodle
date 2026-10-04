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

const ITEMS_PER_PAGE = 5;

export interface MonitoringSessionData {
  id: string;
  examName: string;
  startTime: string;
  duration: number;
  activeCandidates: number;
  totalCandidates: number;
  flags: number;
}

interface ActiveMonitoringTableProps {
  sessions: MonitoringSessionData[];
  loading: boolean;
}

export default function ActiveMonitoringTable({ sessions, loading }: ActiveMonitoringTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = sessions.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSessions = sessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="px-6 py-5 border-b border-slate-200/60 dark:border-slate-800 flex justify-between items-center bg-white/70 dark:bg-slate-900/70 rounded-t-lg backdrop-blur-md">
        <Typography variant="h2" className="text-slate-900 dark:text-white">
          Pemantauan Sesi Aktif
        </Typography>
      </div>

      <Table wrapperClassName="rounded-none rounded-b-lg border-t-0">
        <TableHead>
          <tr>
            <TableHeaderCell>Nama Ujian</TableHeaderCell>
            <TableHeaderCell>Sisa Waktu</TableHeaderCell>
            <TableHeaderCell>Kandidat</TableHeaderCell>
            <TableHeaderCell>Tanda</TableHeaderCell>
            <TableHeaderCell>Aksi</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={`sk-${i}`}>
                <TableCell colSpan={5}>
                  <Skeleton height={20} />
                </TableCell>
              </TableRow>
            ))
          ) : paginatedSessions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">
                Tidak ada sesi ujian aktif.
              </TableCell>
            </TableRow>
          ) : (
            paginatedSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{session.examName}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Dimulai: {session.startTime}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-600 dark:text-slate-300">
                  ~ {session.duration} menit
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300">
                  {session.activeCandidates} / {session.totalCandidates}
                </TableCell>
                <TableCell>
                  {session.flags > 0 ? (
                    <Badge color="error" variant="soft">
                      {session.flags} Baru
                    </Badge>
                  ) : (
                    <Badge color="secondary" variant="soft">
                      0
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" color="primary">
                    Masuk Grid
                  </Button>
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
