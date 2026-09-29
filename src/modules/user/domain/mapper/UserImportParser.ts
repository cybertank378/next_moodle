import { generateSecureMoodlePassword } from "@/core/security/PasswordGenerator";
import type { CreateUserRequestDto } from "../dto/UserRequestDto";
import type { UserImportRowErrorDto } from "../dto/UserResponseDto";

export const USER_IMPORT_TEMPLATE_CSV =
  "\uFEFFusername,firstname,lastname,email,password,idnumber,role,department,institution\n" +
  "siswa01,Ahmad,Dahlan,siswa01@sekolah.sch.id,SiswaPass123!#,1001,student,IPA,SMA 1\n" +
  "siswa02,Budi,Santoso,siswa02@sekolah.sch.id,,1002,student,IPS,SMA 1\n" +
  "guru01,Dewi,Sartika,dewi.sartika@sekolah.sch.id,GuruPass2026!#,2001,teacher,Matematika,SMA 1\n";

export interface MoodleCreateUserPayloadItem {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  idnumber?: string;
  auth: "manual";
  createpassword: 0 | 1;
}

export interface LocalExamImportStudentPayloadItem {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  idnumber?: string;
  courseid?: number;
  groupname?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseCsv(
  csvContent: string,
  fallbackPassword?: string,
): { users: CreateUserRequestDto[]; errors: UserImportRowErrorDto[] } {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { users: [], errors: [] };
  }

  const headerLine = lines[0];
  const delimiter = headerLine.includes(";") ? ";" : ",";
  const headers = headerLine
    .split(delimiter)
    .map((h) => h.trim().toLowerCase());

  const users: CreateUserRequestDto[] = [];
  const errors: UserImportRowErrorDto[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1;
    const rawCols = lines[i].split(delimiter).map((col) => col.trim());

    const rowRecord: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      if (header && j < rawCols.length) {
        rowRecord[header] = rawCols[j];
      }
    }

    const username = rowRecord.username || "";
    const firstname = rowRecord.firstname || "";
    const lastname = rowRecord.lastname || "";
    const email = rowRecord.email || "";
    const password =
      rowRecord.password || fallbackPassword || generateSecureMoodlePassword();
    const idnumber = rowRecord.idnumber || undefined;
    const role = rowRecord.role || "student";
    const department = rowRecord.department || undefined;
    const institution = rowRecord.institution || undefined;

    const rowErrors: string[] = [];
    if (!username) {
      rowErrors.push("Username is required");
    }
    if (!lastname) {
      rowErrors.push("Lastname is required");
    }
    if (!email) {
      rowErrors.push("Email is required");
    } else if (!EMAIL_REGEX.test(email)) {
      rowErrors.push("Email format is invalid");
    }

    if (rowErrors.length > 0) {
      for (const err of rowErrors) {
        errors.push({ row: rowNum, error: err });
      }
    } else {
      users.push({
        username,
        firstname,
        lastname,
        email,
        ...(password ? { password } : {}),
        ...(idnumber ? { idnumber } : {}),
        role,
        ...(department ? { department } : {}),
        ...(institution ? { institution } : {}),
      });
    }
  }

  return { users, errors };
}

function toMoodleCreateUsersPayload(
  users: CreateUserRequestDto[],
): MoodleCreateUserPayloadItem[] {
  return users.map((user) => ({
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    ...(user.password ? { password: user.password } : {}),
    ...(user.idnumber ? { idnumber: user.idnumber } : {}),
    auth: "manual",
    createpassword: user.password ? 0 : 1,
  }));
}

function toLocalExamImportStudentsPayload(
  users: CreateUserRequestDto[],
  options?: { courseId?: number; groupName?: string },
): LocalExamImportStudentPayloadItem[] {
  return users.map((user) => ({
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    ...(user.password ? { password: user.password } : {}),
    ...(user.idnumber ? { idnumber: user.idnumber } : {}),
    ...(options?.courseId ? { courseid: options.courseId } : {}),
    ...(options?.groupName ? { groupname: options.groupName } : {}),
  }));
}

export const UserImportParser = {
  parseCsv,
  toMoodleCreateUsersPayload,
  toLocalExamImportStudentsPayload,
};
