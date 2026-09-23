import type { UserRole } from "@/libs/enums";

export interface RoleMeta {
  label: string;
  description: string;
}

export const roleConfig: Record<UserRole, RoleMeta> = {
  ADMIN: {
    label: "Platform Admin",
    description: "Administrator Sistem Platform Ujian",
  },
  TENANT: {
    label: "Tenant Operator",
    description: "Operator Institusi / Sekolah",
  },
  STUDENT: {
    label: "Peserta Ujian",
    description: "Siswa / Mahasiswa",
  },
};
