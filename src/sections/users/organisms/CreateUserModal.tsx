"use client";

import { useState } from "react";
import type { CreateUserRequestDto } from "@/modules/user/domain/dto/UserRequestDto";
import { Modal } from "@/shared-ui/component/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: CreateUserRequestDto) => Promise<boolean>;
  loading?: boolean;
}

export default function CreateUserModal({
  open,
  onClose,
  onSubmit,
  loading = false,
}: Props) {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idnumber, setIdnumber] = useState("");
  const [role, setRole] = useState("student");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (
      !username.trim() ||
      !firstname.trim() ||
      !lastname.trim() ||
      !email.trim()
    ) {
      setFormError(
        "Username, Nama Depan, Nama Belakang, dan Email wajib diisi.",
      );
      return;
    }

    setFormError(null);
    const success = await onSubmit({
      username: username.trim(),
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email: email.trim(),
      password: password.trim() ? password.trim() : undefined,
      idnumber: idnumber.trim() ? idnumber.trim() : undefined,
      role,
    });

    if (success) {
      setUsername("");
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setIdnumber("");
      setRole("student");
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Tambah Pengguna Baru"
      subtitle="Buat akun pengguna baru di dalam tenant."
      submitText={loading ? "Menyimpan..." : "Simpan Pengguna"}
      cancelText="Batal"
      submitDisabled={loading}
      submitLoading={loading}
      size="md"
    >
      <div className="space-y-4 py-2">
        {formError && (
          <div className="rounded-lg bg-rose-50  border border-rose-200  p-3 text-sm text-rose-600 ">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="create-user-username"
              className="block text-xs font-semibold text-gray-700  mb-1"
            >
              Username *
            </label>
            <input
              id="create-user-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="misal: budi_santoso"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200  bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="create-user-role"
              className="block text-xs font-semibold text-gray-700  mb-1"
            >
              Peran (Role)
            </label>
            <select
              id="create-user-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200  bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="student">Siswa / Peserta</option>
              <option value="teacher">Guru / Pengajar</option>
              <option value="manager">Manager / Admin</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="create-user-firstname"
              className="block text-xs font-semibold text-gray-700  mb-1"
            >
              Nama Depan *
            </label>
            <input
              id="create-user-firstname"
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="misal: Budi"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200  bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="create-user-lastname"
              className="block text-xs font-semibold text-gray-700  mb-1"
            >
              Nama Belakang *
            </label>
            <input
              id="create-user-lastname"
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="misal: Santoso"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200  bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="create-user-email"
            className="block text-xs font-semibold text-gray-700  mb-1"
          >
            Email *
          </label>
          <input
            id="create-user-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="misal: budi@sekolah.sch.id"
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200  bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="create-user-password"
              className="block text-xs font-semibold text-gray-700  mb-1"
            >
              Password (opsional)
            </label>
            <input
              id="create-user-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password awal"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200  bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="create-user-idnumber"
              className="block text-xs font-semibold text-gray-700  mb-1"
            >
              NISN / NIP / ID (opsional)
            </label>
            <input
              id="create-user-idnumber"
              type="text"
              value={idnumber}
              onChange={(e) => setIdnumber(e.target.value)}
              placeholder="misal: 10293847"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200  bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
