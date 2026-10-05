"use client";

import { useState } from "react";
import type { EnrolUserRequestDto } from "@/modules/enrolment/domain/dto/EnrolmentRequestDto";
import SelectField from "@/shared-ui/component/SelectField";
import TextField from "@/shared-ui/component/TextField";
import { Modal } from "@/shared-ui/component/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  courseId: number | null;
  courseTitle?: string;
  onSubmit: (enrolment: EnrolUserRequestDto) => Promise<boolean>;
  loading?: boolean;
}

export default function EnrolUserModal({
  open,
  onClose,
  courseId,
  courseTitle,
  onSubmit,
  loading = false,
}: Props) {
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState(5); // default 5 = student
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!courseId) {
      setErrorMsg("Pilih mata pelajaran terlebih dahulu.");
      return;
    }

    const uid = Number.parseInt(userId.trim(), 10);
    if (Number.isNaN(uid) || uid <= 0) {
      setErrorMsg("Moodle User ID harus berupa angka valid.");
      return;
    }

    setErrorMsg(null);
    const success = await onSubmit({
      courseId,
      userId: uid,
      roleId,
    });

    if (success) {
      setUserId("");
      setRoleId(5);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Daftarkan Pengguna ke Mata Pelajaran"
      subtitle={
        courseTitle
          ? `Mendaftarkan peserta ke mata pelajaran: ${courseTitle}`
          : "Daftarkan pengguna terpilih ke mata pelajaran."
      }
      submitText={loading ? "Mendaftarkan..." : "Daftarkan"}
      cancelText="Batal"
      submitDisabled={loading || !courseId}
      submitLoading={loading}
      size="md"
    >
      <div className="space-y-4 py-2">
        {errorMsg && (
          <div className="rounded-lg bg-rose-50  border border-rose-200  p-3 text-sm text-rose-600 ">
            {errorMsg}
          </div>
        )}

        <div>
          <TextField
            id="enrol-user-id"
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="misal: 10"
            label="User ID (Moodle User ID) *"
            helperText="Masukkan ID unik pengguna yang terdaftar di sistem."
          />
        </div>

        <div>
          <SelectField
            id="enrol-role-id"
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            label="Peran di Course *"
          >
            <option value={5}>Student (Siswa / Peserta Ujian)</option>
            <option value={3}>Editing Teacher (Guru Pengajar)</option>
            <option value={4}>Non-editing Teacher (Pengawas / Asisten)</option>
          </SelectField>
        </div>
      </div>
    </Modal>
  );
}
