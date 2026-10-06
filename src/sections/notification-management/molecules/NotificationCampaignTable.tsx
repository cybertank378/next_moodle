// Files: src/sections/notification-management/molecules/NotificationCampaignTable.tsx
"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Archive,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  FileText,
  Megaphone,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { NotificationCampaignResponseDto } from "@/modules/notification/domain/dto/NotificationCampaignResponseDto";
import NotificationCampaignStatusBadge from "@/sections/notification-management/atoms/NotificationCampaignStatusBadge";
import NotificationChannelBadge from "@/sections/notification-management/atoms/NotificationChannelBadge";
import Button from "@/shared-ui/component/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/shared-ui/component/Table";

interface Props {
  campaigns: NotificationCampaignResponseDto[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onSend: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onNewCampaign?: () => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  loading?: boolean;
}

export default function NotificationCampaignTable({
  campaigns,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onView,
  onEdit,
  onSend,
  onDelete,
  onArchive,
  onNewCampaign,
  onResetFilters,
  hasActiveFilters = false,
  loading = false,
}: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 flex items-center justify-between gap-4 animate-pulse"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-slate-200 rounded" />
                  <div className="h-3 w-1/4 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="h-6 w-16 bg-slate-200 rounded-full" />
              <div className="h-4 w-28 bg-slate-100 rounded" />
              <div className="h-8 w-10 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Filter with 0 results
  if (campaigns.length === 0 && hasActiveFilters) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-10 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto">
          <Send className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Tidak ada hasil yang sesuai
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau reset filter untuk menemukan
            pengumuman lainnya.
          </p>
        </div>
        {onResetFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 mx-auto text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filter
          </Button>
        )}
      </div>
    );
  }

  // System has 0 campaigns - Exactly matching mockup
  if (campaigns.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
          {/* Cloud + dotted loop + blue paper plane illustration */}
          <div className="w-[120px] h-[60px] flex items-center justify-center shrink-0">
            <svg
              width="120"
              height="60"
              viewBox="0 0 120 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
              aria-hidden="true"
            >
              <path
                d="M18 42C14.6863 42 12 39.3137 12 36C12 32.9645 14.2583 30.4578 17.2155 30.0637C17.0734 29.4005 17 28.71 17 28C17 22.4772 21.4772 18 27 18C31.5234 18 35.3135 21.0069 36.5292 25.1328C37.581 24.4172 38.8647 24 40.25 24C43.4256 24 46 26.5744 46 29.75C46 30.1264 45.9639 30.4943 45.8947 30.8504C48.2435 31.7923 49.875 34.0805 49.875 36.75C49.875 40.2018 47.0768 43 43.625 43H18Z"
                fill="#E2E8F0"
                opacity="0.95"
              />
              <path
                d="M38 36C46 44 58 44 65 37C72 30 68 18 58 22C50 26 52 38 64 40C76 42 88 32 96 22"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray="3 3"
                strokeLinecap="round"
              />
              <g transform="translate(94, 14) rotate(15)">
                <path d="M0 8L20 0L12 18L8 11L0 8Z" fill="#2563EB" />
                <path d="M8 11L12 18L10 11L8 11Z" fill="#1D4ED8" />
              </g>
            </svg>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Belum ada pengumuman
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Mulai buat pengumuman untuk tenant Anda.
            </p>
          </div>
        </div>

        {onNewCampaign && (
          <Button
            variant="outline"
            size="sm"
            onClick={onNewCampaign}
            className="flex items-center gap-2 font-semibold border-blue-600 text-blue-600 hover:bg-blue-50 bg-white whitespace-nowrap px-4 py-2 rounded-xl text-xs"
          >
            <Plus className="w-4 h-4" />
            Buat Pengumuman
          </Button>
        )}
      </div>
    );
  }

  const formatAudience = (campaign: NotificationCampaignResponseDto) => {
    const spec = campaign.audienceSpec;
    if (spec.scope === "ALL") return "Semua tenant";
    if (spec.scope === "ROLES") return `Role: ${spec.roles?.join(", ") || "-"}`;
    if (spec.scope === "TENANT") return "SMP Hangtuah 2";
    if (spec.scope === "USERS") return `${spec.userIds?.length || 0} tenant`;
    return spec.scope;
  };

  const getRowIcon = (camp: NotificationCampaignResponseDto) => {
    const t = camp.title.toLowerCase();
    if (
      camp.dispatchStatus === "SCHEDULED" ||
      t.includes("jadwal") ||
      t.includes("ujian")
    ) {
      return <Calendar className="w-4 h-4 text-blue-600" />;
    }
    if (
      t.includes("panduan") ||
      t.includes("pengumuman") ||
      t.includes("info")
    ) {
      return <Megaphone className="w-4 h-4 text-blue-600" />;
    }
    return <FileText className="w-4 h-4 text-blue-600" />;
  };

  const formatTime = (camp: NotificationCampaignResponseDto) => {
    if (camp.dispatchStatus === "SCHEDULED" && camp.scheduledAt) {
      return format(new Date(camp.scheduledAt), "dd MMM yyyy HH:mm", {
        locale: localeId,
      });
    }

    if (camp.dispatchStatus === "DRAFT") {
      return "Belum dijadwalkan";
    }

    return format(new Date(camp.createdAt), "dd MMM yyyy HH:mm", {
      locale: localeId,
    });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow className="border-b border-slate-200 bg-slate-50/50">
              <TableHeaderCell className="w-2/5 py-4 pl-6 text-xs font-semibold text-slate-600">
                Pengumuman
              </TableHeaderCell>
              <TableHeaderCell className="py-4 text-xs font-semibold text-slate-600">
                Audiens
              </TableHeaderCell>
              <TableHeaderCell className="py-4 text-xs font-semibold text-slate-600">
                Kanal
              </TableHeaderCell>
              <TableHeaderCell className="py-4 text-xs font-semibold text-slate-600">
                Status
              </TableHeaderCell>
              <TableHeaderCell className="py-4 text-xs font-semibold text-slate-600">
                Waktu
              </TableHeaderCell>
              <TableHeaderCell className="py-4 pr-6 text-right text-xs font-semibold text-slate-600">
                Aksi
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((camp) => (
              <TableRow
                key={camp.id}
                className="hover:bg-slate-50/70 transition-colors h-[70px] border-b border-slate-100 last:border-b-0"
              >
                {/* Column 1: Pengumuman with Icon */}
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0">
                      {getRowIcon(camp)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 line-clamp-1 text-sm">
                        {camp.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Oleh{" "}
                        {camp.createdByRole === "ADMIN"
                          ? "Admin Platform"
                          : "Admin Sekolah"}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Column 2: Audiens */}
                <TableCell>
                  <span className="text-sm text-slate-700 font-normal">
                    {formatAudience(camp)}
                  </span>
                </TableCell>

                {/* Column 3: Kanal */}
                <TableCell>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {camp.channels.map((ch) => (
                      <NotificationChannelBadge key={ch} channel={ch} />
                    ))}
                  </div>
                </TableCell>

                {/* Column 4: Status */}
                <TableCell>
                  <NotificationCampaignStatusBadge
                    status={camp.dispatchStatus}
                    isArchived={camp.archivedAt !== null}
                  />
                </TableCell>

                {/* Column 5: Waktu */}
                <TableCell>
                  <span className="text-sm text-slate-600">
                    {formatTime(camp)}
                  </span>
                </TableCell>

                {/* Column 6: Aksi (Three Dots Menu) */}
                <TableCell className="pr-6 text-right">
                  <div
                    className="relative inline-block text-left"
                    ref={openMenuId === camp.id ? menuRef : undefined}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(openMenuId === camp.id ? null : camp.id)
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      aria-label="Aksi pengumuman"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {openMenuId === camp.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            onView(camp.id);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-slate-700 transition-colors"
                        >
                          <Eye className="w-4 h-4 text-slate-500" />
                          Lihat Detail
                        </button>

                        {camp.dispatchStatus === "DRAFT" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onEdit(camp.id);
                              }}
                              className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-slate-700 transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-slate-500" />
                              Ubah Draft
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onSend(camp.id);
                              }}
                              className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-blue-600 transition-colors"
                            >
                              <Send className="w-4 h-4 text-blue-600" />
                              Kirim Sekarang
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onDelete(camp.id);
                              }}
                              className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-rose-50 text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-rose-600" />
                              Hapus Draft
                            </button>
                          </>
                        )}

                        <div className="my-1 border-t border-slate-100" />

                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            onArchive(camp.id);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-slate-600 transition-colors"
                        >
                          <Archive className="w-4 h-4 text-slate-400" />
                          {camp.archivedAt ? "Batal Arsip" : "Arsipkan"}
                        </button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Menampilkan {total === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
          {Math.min(currentPage * pageSize, total)} dari {total} pengumuman
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition-colors"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from(
            { length: Math.max(1, Math.ceil(total / pageSize)) },
            (_, idx) => idx + 1,
          )
            .filter(
              (p) =>
                p === 1 ||
                p === Math.ceil(total / pageSize) ||
                Math.abs(p - currentPage) <= 1,
            )
            .map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                  currentPage === p
                    ? "bg-blue-600 text-white shadow-xs"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
          <button
            type="button"
            disabled={currentPage >= Math.ceil(total / pageSize)}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition-colors"
            aria-label="Halaman selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
