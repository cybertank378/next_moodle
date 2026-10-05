// Files: src/sections/notification-management/molecules/NotificationDeliveryTable.tsx
"use client";

import type {
  NotificationDeliveryItemDto,
} from "@/modules/notification/domain/dto/NotificationCampaignResponseDto";
import type { NotificationDeliverySummary } from "@/modules/notification/domain/types/NotificationTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/shared-ui/component/Table";
import Pagination from "@/shared-ui/component/Pagination";
import Button from "@/shared-ui/component/Button";
import EmptyState from "@/shared-ui/component/EmptyState";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Send, Inbox, Bell } from "lucide-react";

interface Props {
  deliveries: NotificationDeliveryItemDto[];
  total: number;
  summary?: NotificationDeliverySummary;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRetryFailed?: () => void;
  retrying?: boolean;
}

export default function NotificationDeliveryTable({
  deliveries,
  total,
  summary,
  currentPage,
  pageSize,
  onPageChange,
  onRetryFailed,
  retrying = false,
}: Props) {
  const getStatusBadge = (status: string, errorCode: string | null) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Terkirim
          </span>
        );
      case "FAILED":
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"
            title={errorCode || "Gagal"}
          >
            <XCircle className="w-3 h-3 text-rose-500" />
            Gagal ({errorCode || "Error"})
          </span>
        );
      case "SKIPPED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <AlertCircle className="w-3 h-3 text-slate-400" />
            Dilewati (Tanpa Perangkat)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Menunggu
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Metric Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Total Sasaran</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{summary.total}</div>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Inbox className="w-3.5 h-3.5 text-slate-400" /> Inbox Dibuat
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">{summary.inboxCreated}</div>
          </div>
          <div className="p-4 bg-white border border-emerald-200 rounded-xl shadow-xs bg-emerald-50/20">
            <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-emerald-600" /> Push Diterima
            </div>
            <div className="text-xl font-bold text-emerald-700 mt-1">{summary.pushAccepted}</div>
          </div>
          <div className="p-4 bg-white border border-rose-200 rounded-xl shadow-xs bg-rose-50/20">
            <div className="text-xs text-rose-700 font-medium flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-600" /> Push Gagal
            </div>
            <div className="text-xl font-bold text-rose-700 mt-1">{summary.pushFailed}</div>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" /> Tanpa Perangkat
            </div>
            <div className="text-xl font-bold text-slate-600 mt-1">{summary.pushSkipped}</div>
          </div>
        </div>
      )}

      {/* Table Panel */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Rincian Pengiriman per Penerima</h3>
          {onRetryFailed && summary && summary.pushFailed > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetryFailed}
              disabled={retrying}
              className="text-xs flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retrying ? "animate-spin" : ""}`} />
              Coba Ulang yang Gagal ({summary.pushFailed})
            </Button>
          )}
        </div>

        {deliveries.length === 0 ? (
          <EmptyState
            title="Belum Ada Riwayat Pengiriman"
            description="Pengiriman belum dieksekusi untuk pengumuman ini."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Penerima</TableHeaderCell>
                    <TableHeaderCell>Role</TableHeaderCell>
                    <TableHeaderCell>Saluran</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Percobaan</TableHeaderCell>
                    <TableHeaderCell>Waktu</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliveries.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs font-medium text-slate-800">
                        {item.recipientId}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">{item.recipientRole}</TableCell>
                      <TableCell>
                        <span className="text-xs font-medium text-slate-700">
                          {item.channel === "IN_APP" ? "Inbox Aplikasi" : "Push Notifikasi"}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status, item.errorCode)}</TableCell>
                      <TableCell className="text-xs text-slate-500">{item.attempts}x</TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {item.acceptedAt
                          ? format(new Date(item.acceptedAt), "dd MMM HH:mm:ss", {
                              locale: localeId,
                            })
                          : format(new Date(item.createdAt), "dd MMM HH:mm:ss", {
                              locale: localeId,
                            })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {total > pageSize && (
              <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div>
                  Menampilkan {deliveries.length} dari {total} data
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalItems={total}
                  itemsPerPage={pageSize}
                  onPageChangeAction={onPageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
