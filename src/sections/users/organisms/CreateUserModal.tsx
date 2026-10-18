"use client";

import { useState } from "react";
import type { CreateUserRequestDto } from "@/modules/user/domain/dto/UserRequestDto";
import { Modal } from "@/shared-ui/component/Modal";
import SelectField from "@/shared-ui/component/SelectField";
import TextField from "@/shared-ui/component/TextField";

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
          <TextField
            id="create-user-username"
            label="Username *"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="misal: budi_santoso"
          />

          <SelectField
            id="create-user-role"
            label="Peran (Role)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Siswa / Peserta</option>
            <option value="teacher">Guru / Pengajar</option>
            <option value="manager">Manager / Admin</option>
          </SelectField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            id="create-user-firstname"
            label="Nama Depan *"
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="misal: Budi"
          />

          <TextField
            id="create-user-lastname"
            label="Nama Belakang *"
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="misal: Santoso"
          />
        </div>

        <TextField
          id="create-user-email"
          label="Email *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="misal: budi@sekolah.sch.id"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            id="create-user-password"
            label="Password (opsional)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password awal"
            enablePasswordToggle
          />

          <TextField
            id="create-user-idnumber"
            label="NISN / NIP / ID (opsional)"
            type="text"
            value={idnumber}
            onChange={(e) => setIdnumber(e.target.value)}
            placeholder="misal: 10293847"
          />
        </div>
      </div>
    </Modal>
  );
}
