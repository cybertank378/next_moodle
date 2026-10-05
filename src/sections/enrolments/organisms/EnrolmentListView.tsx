"use client";

import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCourseApi } from "@/modules/course/presentation/hooks/useCourseApi";
import type { EnrolUserRequestDto } from "@/modules/enrolment/domain/dto/EnrolmentRequestDto";
import { useEnrolmentApi } from "@/modules/enrolment/presentation/hooks/useEnrolmentApi";
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
import EnrolmentRoleBadge from "@/sections/enrolments/atoms/EnrolmentRoleBadge";
import EnrolmentFilterBar from "@/sections/enrolments/molecules/EnrolmentFilterBar";
import EnrolUserModal from "@/sections/enrolments/organisms/EnrolUserModal";

const PAGE_SIZE = 10;
const SKELETON_KEYS = [
  "skel-enrol-1",
  "skel-enrol-2",
  "skel-enrol-3",
  "skel-enrol-4",
  "skel-enrol-5",
];

export default function EnrolmentListView() {
  const { coursesState, listCourses } = useCourseApi();
  const {
    enrolmentsState,
    enrolState,
    unenrolState,
    listEnrolments,
    enrolUser,
    unenrolUser,
  } = useEnrolmentApi();

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEnrolOpen, setIsEnrolOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load available courses on mount
  useEffect(() => {
    void listCourses();
  }, [listCourses]);

  const courses = coursesState.data?.courses ?? [];

  // Automatically select first course when courses are loaded
  useEffect(() => {
    if (courses.length > 0 && selectedCourseId === null) {
      const firstCourse = courses[0];
      if (firstCourse) {
        setSelectedCourseId(firstCourse.id);
      }
    }
  }, [courses, selectedCourseId]);

  // Load enrolments when courseId, search, or page changes
  useEffect(() => {
    if (selectedCourseId) {
      void listEnrolments({
        courseId: selectedCourseId,
        search,
        page: currentPage,
        pageSize: PAGE_SIZE,
      });
    }
  }, [selectedCourseId, search, currentPage, listEnrolments]);

  const enrolments = enrolmentsState.data?.enrolments ?? [];
  const total = enrolmentsState.data?.total ?? 0;
  const loading = enrolmentsState.loading;

  const currentCourse = courses.find((c) => c.id === selectedCourseId);

  const handleEnrol = async (dto: EnrolUserRequestDto) => {
    const res = await enrolUser(dto);
    if (res.data) {
      setToastMessage("Peserta berhasil didaftarkan ke mata pelajaran!");
      if (selectedCourseId) {
        void listEnrolments({
          courseId: selectedCourseId,
          search,
          page: currentPage,
          pageSize: PAGE_SIZE,
        });
      }
      return true;
    }
    return false;
  };

  const handleUnenrol = async (userId: number, fullname: string) => {
    if (!selectedCourseId) return;
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin membatalkan pendaftaran ${fullname} dari mata pelajaran ini?`,
    );
    if (!confirmed) return;

    const res = await unenrolUser({ courseId: selectedCourseId, userId });
    if (res.data) {
      setToastMessage(`Pendaftaran ${fullname} berhasil dibatalkan.`);
      void listEnrolments({
        courseId: selectedCourseId,
        search,
        page: currentPage,
        pageSize: PAGE_SIZE,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs font-semibold hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Pendaftaran Mata Pelajaran (Enrolments)
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            Kelola pendaftaran peserta dan penugasan peran guru di setiap
            mata pelajaran.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151521] p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
              Mata Pelajaran Aktif
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate max-w-[180px]">
              {currentCourse?.fullName || "Belum dipilih"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151521] p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <GraduationCap size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
              Total Terdaftar
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {loading ? "..." : total}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151521] p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
              Ditampilkan di Halaman
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {loading ? "..." : enrolments.length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter / Search */}
      <EnrolmentFilterBar
        courses={courses}
        selectedCourseId={selectedCourseId}
        onCourseSelect={(id) => {
          setSelectedCourseId(id);
          setCurrentPage(1);
        }}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        onEnrolClick={() => setIsEnrolOpen(true)}
      />

      {/* Error state */}
      {enrolmentsState.error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-500 dark:text-rose-400">
          {enrolmentsState.error}
        </div>
      )}

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Nama Peserta</TableHeaderCell>
            <TableHeaderCell>Username</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Peran di Mata Pelajaran</TableHeaderCell>
            <TableHeaderCell className="text-right">Aksi</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            SKELETON_KEYS.map((key) => (
              <TableRow key={key}>
                <TableCell>
                  <Skeleton width={140} height={16} />
                </TableCell>
                <TableCell>
                  <Skeleton width={90} height={16} />
                </TableCell>
                <TableCell>
                  <Skeleton width={160} height={16} />
                </TableCell>
                <TableCell>
                  <Skeleton width={80} height={20} />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton width={50} height={20} className="ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : !selectedCourseId ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500 dark:text-gray-400">
                  <BookOpen size={32} className="stroke-1 mb-2" />
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Pilih mata pelajaran terlebih dahulu
                  </p>
                  <p className="text-xs mt-1">
                    Silakan pilih salah satu mata pelajaran di atas untuk melihat data
                    pendaftaran peserta.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : enrolments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500 dark:text-gray-400">
                  <Users size={32} className="stroke-1 mb-2" />
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Belum ada peserta terdaftar
                  </p>
                  <p className="text-xs mt-1">
                    {search
                      ? "Tidak ada peserta yang cocok dengan kata kunci pencarian Anda."
                      : "Mata pelajaran ini belum memiliki peserta terdaftar. Klik 'Daftarkan Peserta' untuk menambahkan."}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            enrolments.map((enrol) => (
              <TableRow key={`${enrol.courseId}-${enrol.userId}`}>
                <TableCell className="font-semibold text-slate-900 dark:text-white">
                  {enrol.fullname}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {enrol.username}
                </TableCell>
                <TableCell>{enrol.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 flex-wrap">
                    {enrol.roles.length > 0 ? (
                      enrol.roles.map((r) => (
                        <EnrolmentRoleBadge
                          key={`${enrol.userId}-role-${r.roleId}`}
                          roleName={r.name}
                        />
                      ))
                    ) : (
                      <EnrolmentRoleBadge roleName="Peserta" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    color="error"
                    size="sm"
                    onClick={() => handleUnenrol(enrol.userId, enrol.fullname)}
                    disabled={unenrolState.loading}
                    title="Batalkan pendaftaran"
                    leftIcon={Trash2}
                    className="text-xs"
                  >
                    Batal Daftar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {!loading && total > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={PAGE_SIZE}
          onPageChangeAction={(page) => setCurrentPage(page)}
        />
      )}

      {/* Enrol User Modal */}
      <EnrolUserModal
        open={isEnrolOpen}
        onClose={() => setIsEnrolOpen(false)}
        courseId={selectedCourseId}
        courseTitle={currentCourse?.fullName}
        onSubmit={handleEnrol}
        loading={enrolState.loading}
      />
    </div>
  );
}
