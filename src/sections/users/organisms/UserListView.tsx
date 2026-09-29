"use client";

import { CheckCircle2, Search, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  BulkImportUsersRequestDto,
  CreateUserRequestDto,
} from "@/modules/user/domain/dto/UserRequestDto";
import { useUserApi } from "@/modules/user/presentation/hooks/useUserApi";
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
import UserStatusBadge from "../atoms/UserStatusBadge";
import UserFilterBar from "../molecules/UserFilterBar";
import CreateUserModal from "./CreateUserModal";
import UserImportModal from "./UserImportModal";

const PAGE_SIZE = 10;
const SKELETON_KEYS = [
  "skel-user-1",
  "skel-user-2",
  "skel-user-3",
  "skel-user-4",
  "skel-user-5",
];

export default function UserListView() {
  const {
    usersState,
    createState,
    importState,
    listUsers,
    createUser,
    importUsers,
  } = useUserApi();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    void listUsers({ search, page: currentPage, pageSize: PAGE_SIZE });
  }, [search, currentPage, listUsers]);

  const users = usersState.data?.users ?? [];
  const total = usersState.data?.total ?? 0;
  const loading = usersState.loading;

  const handleCreateUser = async (user: CreateUserRequestDto) => {
    const res = await createUser(user);
    if (res.data) {
      setToastMessage("Pengguna baru berhasil ditambahkan!");
      void listUsers({ search, page: currentPage, pageSize: PAGE_SIZE });
      return true;
    }
    return false;
  };

  const handleImportUsers = async (req: BulkImportUsersRequestDto) => {
    const res = await importUsers(req);
    if (res.data) {
      setToastMessage(`Berhasil mengimpor ${res.data.importedCount} pengguna!`);
      void listUsers({ search, page: currentPage, pageSize: PAGE_SIZE });
      return res.data;
    }
    return null;
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
            Manajemen Pengguna
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            Kelola data peserta, pengajar, dan admin dalam institusi tenant.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151521] p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
              Total Pengguna
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {loading ? "..." : total}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151521] p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
              Pengguna Aktif
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {loading ? "..." : users.filter((u) => !u.suspended).length}
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
              {loading ? "..." : users.length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter / Search */}
      <UserFilterBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        onCreateClick={() => setIsCreateOpen(true)}
        onImportClick={() => setIsImportOpen(true)}
      />

      {/* Error state */}
      {usersState.error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-500 dark:text-rose-400">
          {usersState.error}
        </div>
      )}

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Nama Lengkap</TableHeaderCell>
            <TableHeaderCell>Username</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>NISN / NIP</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
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
                  <Skeleton width={80} height={16} />
                </TableCell>
                <TableCell>
                  <Skeleton width={60} height={20} />
                </TableCell>
              </TableRow>
            ))
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500 dark:text-gray-400">
                  <Search size={32} className="stroke-1 mb-2" />
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Tidak ada pengguna ditemukan
                  </p>
                  <p className="text-xs mt-1">
                    {search
                      ? "Coba gunakan kata kunci pencarian yang lain."
                      : "Belum ada data pengguna terdaftar di institusi ini."}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-semibold text-slate-900 dark:text-white">
                  {user.fullname}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {user.username}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.idnumber || "-"}</TableCell>
                <TableCell>
                  <UserStatusBadge suspended={user.suspended} />
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

      {/* Create User Modal */}
      <CreateUserModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateUser}
        loading={createState.loading}
      />

      {/* Import User Modal */}
      <UserImportModal
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImportUsers}
        loading={importState.loading}
      />
    </div>
  );
}
