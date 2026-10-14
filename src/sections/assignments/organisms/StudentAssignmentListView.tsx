"use client";

import { AlertCircle, FileText, Filter, RefreshCw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AssignmentItemDTO } from "@/modules/assignment/domain/dto/AssignmentResponseDTO";
import { useAssignmentApi } from "@/modules/assignment/presentation/hooks/useAssignmentApi";
import { AssignmentCard } from "@/sections/assignments/molecules/AssignmentCard";
import { AssignmentDetailModal } from "@/sections/assignments/molecules/AssignmentDetailModal";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import EmptyState from "@/shared-ui/component/EmptyState";
import Skeleton from "@/shared-ui/component/Skeleton";

export function StudentAssignmentListView() {
  const { data, loading, error, fetchAssignments } = useAssignmentApi();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentItemDTO | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const filteredAssignments = useMemo(() => {
    if (!data?.items) return [];
    let items = data.items;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.courseName?.toLowerCase().includes(q) ||
          a.intro?.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "ALL") {
      items = items.filter((a) => a.status === statusFilter);
    }

    return items;
  }, [data, search, statusFilter]);

  const handleSelect = (assignment: AssignmentItemDTO) => {
    setSelectedAssignment(assignment);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tugas & Penugasan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Lihat daftar tugas pembelajaran dari mata pelajaran yang Anda ikuti.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          color="secondary"
          leftIcon={RefreshCw}
          loading={loading}
          onClick={() => fetchAssignments()}
        >
          Perbarui
        </Button>
      </div>

      {/* Backend Contract Blocked Banner */}
      {data?.meta.backendBlocked && (
        <Card className="p-4 border-amber-200 bg-amber-50/80 text-amber-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Integrasi Backend Dalam Pengembangan (Moodle Contract Notice)
            </span>
            <p className="text-xs text-amber-700 leading-relaxed">
              {data.meta.backendBlockedReason ||
                "Layanan Moodle API (plugin local_examapi) untuk modul penugasan (mod_assign) saat ini belum terdaftar pada kontrak backend resmi."}
            </p>
          </div>
        </Card>
      )}

      {/* Toolbar / Search / Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tugas atau mata pelajaran..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 w-full sm:w-auto"
          >
            <option value="ALL">Semua Status</option>
            <option value="NEW">Belum Dikerjakan</option>
            <option value="DRAFT">Draf</option>
            <option value="SUBMITTED">Terkirim</option>
            <option value="GRADED">Dinilai</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <div className="flex-1 text-sm">{error}</div>
          <Button
            variant="outline"
            size="sm"
            color="danger"
            onClick={() => fetchAssignments()}
          >
            Coba Lagi
          </Button>
        </Card>
      )}

      {/* Loading State */}
      {loading && !data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAssignments.length === 0 && (
        <EmptyState
          icon={<FileText className="w-8 h-8 text-slate-400" />}
          title="Tidak Ada Tugas Tersedia"
          description={
            search || statusFilter !== "ALL"
              ? "Tidak ada penugasan yang sesuai dengan filter pencarian Anda."
              : data?.meta.backendBlocked
                ? "Daftar tugas akan ditampilkan secara otomatis setelah plugin modul mod_assign Moodle terdaftar."
                : "Saat ini Anda belum memiliki tugas yang ditugaskan pada kursus yang terdaftar."
          }
        />
      )}

      {/* Assignment Grid */}
      {!loading && filteredAssignments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AssignmentDetailModal
        assignment={selectedAssignment}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
