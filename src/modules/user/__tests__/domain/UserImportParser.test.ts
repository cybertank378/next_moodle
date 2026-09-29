import { describe, expect, it } from "vitest";
import {
  USER_IMPORT_TEMPLATE_CSV,
  UserImportParser,
} from "../../domain/mapper/UserImportParser";

describe("UserImportParser", () => {
  it("parses valid comma-separated CSV text into CreateUserRequestDto array", () => {
    const csvContent = `username,firstname,lastname,email,password,idnumber,role
student01,Budi,Santoso,budi@example.com,Pass123!,12345,student
teacher01,Siti,Aminah,siti@example.com,Pass123!,67890,teacher`;

    const result = UserImportParser.parseCsv(csvContent, "DefaultPass123!");

    expect(result.errors).toHaveLength(0);
    expect(result.users).toHaveLength(2);
    expect(result.users[0]).toEqual({
      username: "student01",
      firstname: "Budi",
      lastname: "Santoso",
      email: "budi@example.com",
      password: "Pass123!",
      idnumber: "12345",
      role: "student",
    });
    expect(result.users[1].username).toBe("teacher01");
    expect(result.users[1].role).toBe("teacher");
  });

  it("parses semicolon-separated CSV text with trimmed spaces and fallback password", () => {
    const csvContent = `username; firstname ; lastname ; email ; idnumber
siswa_02 ; Ani ; Wijaya ; ani@sekolah.sch.id ; 998877`;

    const result = UserImportParser.parseCsv(csvContent, "FallbackPass123!");

    expect(result.errors).toHaveLength(0);
    expect(result.users).toHaveLength(1);
    expect(result.users[0]).toEqual({
      username: "siswa_02",
      firstname: "Ani",
      lastname: "Wijaya",
      email: "ani@sekolah.sch.id",
      password: "FallbackPass123!",
      idnumber: "998877",
      role: "student",
    });
  });

  it("records error for rows with missing required fields or invalid email", () => {
    const invalidCsv = `username,firstname,lastname,email
,TanpaUsername,User,valid@example.com
user02,Budi,,budi@example.com
user03,Siti,Aminah,invalid-email-format`;

    const result = UserImportParser.parseCsv(invalidCsv);

    expect(result.users).toHaveLength(0);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
    expect(result.errors[0].row).toBe(2);
    expect(result.errors[0].error).toContain("Username");
    expect(result.errors[1].error).toContain("Lastname");
    expect(result.errors[2].error).toContain("Email");
  });

  it("converts parsed user DTOs to Moodle core_user_create_users payload structure", () => {
    const users = [
      {
        username: "student01",
        firstname: "Budi",
        lastname: "Santoso",
        email: "budi@example.com",
        password: "Pass123!",
        idnumber: "12345",
      },
    ];

    const moodlePayload = UserImportParser.toMoodleCreateUsersPayload(users);

    expect(moodlePayload).toEqual([
      {
        username: "student01",
        firstname: "Budi",
        lastname: "Santoso",
        email: "budi@example.com",
        password: "Pass123!",
        idnumber: "12345",
        auth: "manual",
        createpassword: 0,
      },
    ]);
  });

  it("converts parsed user DTOs to custom local_exam_import_students payload structure", () => {
    const users = [
      {
        username: "student01",
        firstname: "Budi",
        lastname: "Santoso",
        email: "budi@example.com",
        password: "Pass123!",
        idnumber: "12345",
      },
    ];

    const customPayload = UserImportParser.toLocalExamImportStudentsPayload(
      users,
      {
        courseId: 10,
        groupName: "Kelas-10A",
      },
    );

    expect(customPayload).toEqual([
      {
        username: "student01",
        firstname: "Budi",
        lastname: "Santoso",
        email: "budi@example.com",
        password: "Pass123!",
        idnumber: "12345",
        courseid: 10,
        groupname: "Kelas-10A",
      },
    ]);
  });

  it("auto-generates strong Moodle-compliant password if none is provided in CSV and no fallback", () => {
    const csvContent = `username,firstname,lastname,email
siswa_autopass,Rini,Suharto,rini@example.com`;

    const result = UserImportParser.parseCsv(csvContent);

    expect(result.errors).toHaveLength(0);
    expect(result.users).toHaveLength(1);
    const pwd = result.users[0].password;
    expect(pwd).toBeDefined();
    expect(typeof pwd).toBe("string");
    expect(pwd!.length).toBeGreaterThanOrEqual(8);
    expect(pwd).toMatch(/[a-z]/);
    expect(pwd).toMatch(/[A-Z]/);
    expect(pwd).toMatch(/[0-9]/);
    expect(pwd).toMatch(/[!@#$%&*?]/);
  });

  it("successfully parses USER_IMPORT_TEMPLATE_CSV sample template without errors", () => {
    const result = UserImportParser.parseCsv(USER_IMPORT_TEMPLATE_CSV);

    expect(result.errors).toHaveLength(0);
    expect(result.users).toHaveLength(3);
    expect(result.users[0].username).toBe("siswa01");
    expect(result.users[1].username).toBe("siswa02");
    expect(result.users[2].username).toBe("guru01");
    // Verify siswa02 got a secure auto-generated password since password column is empty
    expect(result.users[1].password).toBeDefined();
    expect(result.users[1].password!.length).toBeGreaterThanOrEqual(8);
  });
});
