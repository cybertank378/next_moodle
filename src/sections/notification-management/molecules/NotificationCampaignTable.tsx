// Files: src/sections/notification-management/molecules/NotificationCampaignTable.tsx
"use client";

import type { NotificationCampaignResponseDto } from "@/modules/notification/domain/dto/NotificationCampaignResponseDto";
import NotificationCampaignStatusBadge from "@/sections/notification-management/atoms/NotificationCampaignStatusBadge";
import NotificationChannelBadge from "@/sections/notification-management/atoms/NotificationChannelBadge";
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
import { Eye, Edit2, Trash2, Send, Clock, Archive } from "lucide-react";

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
  loading = false,
}: Props) {
  if (campaigns.length === 0 && !loading) {
    return (
      <EmptyState
        title="Belum Ada Pengumuman"
        description="Belum ada pengumuman yang sesuai dengan filter atau dibuat pada saat ini."
      />
    );
  }

  const formatAudience = (campaign: NotificationCampaignResponseDto) => {
    const spec = campaign.audienceSpec;
    if (spec.scope === "ALL") return "Seluruh Pengguna";
    if (spec.scope === "ROLES") return `Role: ${spec.roles?.join(", ") || "-"}`;
    if (spec.scope === "TENANT") return "Sekolah / Tenant Tertentu";
    if (spec.scope === "USERS") return `${spec.userIds?.length || 0} Pengguna Terpilih`;
    return spec.scope;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-1/3">Judul & Ringkasan</TableHeaderCell>
              <TableHeaderCell>Target Audiens</TableHeaderCell>
              <TableHeaderCell>Saluran</TableHeaderCell>
              <TableHeaderCell>Status / Jadwal</TableHeaderCell>
              <TableHeaderCell>Tanggal</TableHeaderCell>
              <TableHeaderCell className="text-right">Aksi</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((camp) => (
              <TableRow key={camp.id} className="hover:bg-slate-50/70 transition-colors">
                <TableCell>
                  <div className="font-semibold text-slate-900 line-clamp-1">{camp.title}</div>
                  <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {camp.pushSummary || camp.plainText || "Tidak ada ringkasan teks."}
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-xs font-medium text-slate-700">
                    {formatAudience(camp)}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap items-center gap-1">
                    {camp.channels.map((ch) => (
                      <NotificationChannelBadge key={ch} channel={ch} />
                    ))}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1 items-start">
                    <NotificationCampaignStatusBadge
                      status={camp.dispatchStatus}
                      isArchived={camp.archivedAt !== null}
                    />
                    {camp.scheduledAt && camp.dispatchStatus === "SCHEDULED" && (
                      <span className="text-[11px] text-amber-600 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {format(new Date(camp.scheduledAt), "dd MMM yyyy, HH:mm", {
                          locale: localeId,
                        })}
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-xs text-slate-500">
                    {format(new Date(camp.createdAt), "dd MMM yyyy", { locale: localeId })}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(camp.id)}
                      title="Lihat Detail"
                      aria-label="Lihat Detail"
                    >
                      <Eye className="w-4 h-4 text-slate-600" />
                    </Button>

                    {camp.dispatchStatus === "DRAFT" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(camp.id)}
                          title="Ubah Draft"
                          aria-label="Ubah Draft"
                        >
                          <Edit2 className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSend(camp.id)}
                          title="Kirim Sekarang"
                          aria-label="Kirim Sekarang"
                        >
                          <Send className="w-4 h-4 text-indigo-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(camp.id)}
                          title="Hapus Draft"
                          aria-label="Hapus Draft"
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onArchive(camp.id)}
                      title={camp.archivedAt ? "Batal Arsip" : "Arsipkan"}
                      aria-label={camp.archivedAt ? "Batal Arsip" : "Arsipkan"}
                    >
                      <Archive className="w-4 h-4 text-slate-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {total > pageSize && (
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan {campaigns.length} dari {total} pengumuman
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={total}
            itemsPerPage={pageSize}
            onPageChangeAction={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
