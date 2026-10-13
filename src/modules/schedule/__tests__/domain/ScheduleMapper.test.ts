import { describe, expect, it } from "vitest";
import { ScheduleSessionEntity } from "@/modules/schedule/domain/entity/ScheduleSessionEntity";
import { ScheduleMapper } from "@/modules/schedule/domain/mapper/ScheduleMapper";

describe("ScheduleMapper", () => {
  it("correctly maps ScheduleSessionEntity to ScheduleSessionItemDTO", () => {
    const entity = new ScheduleSessionEntity("quiz-10", "tenant-1", {
      id: "quiz-10",
      sessionType: "EXAM",
      title: "Ujian Tengah Semester Matematika",
      startsAt: "2026-10-15T08:00:00.000Z",
      endsAt: "2026-10-15T10:00:00.000Z",
      allDay: false,
      courseId: 101,
      courseName: "Matematika Tingkat Lanjut",
      subjectCode: "MATH-101",
      room: "Lab Komputer A",
      instructor: "Dr. Budi Santoso",
      classGroup: "Kelas XII IPA 1",
      status: "SCHEDULED",
      detailRoute: "/dashboard/exams/10",
      description: "Membawa kalkulator saintifik.",
    });

    const dto = ScheduleMapper.toDTO(entity);

    expect(dto.id).toBe("quiz-10");
    expect(dto.sessionType).toBe("EXAM");
    expect(dto.title).toBe("Ujian Tengah Semester Matematika");
    expect(dto.startsAt).toBe("2026-10-15T08:00:00.000Z");
    expect(dto.endsAt).toBe("2026-10-15T10:00:00.000Z");
    expect(dto.allDay).toBe(false);
    expect(dto.courseId).toBe(101);
    expect(dto.courseName).toBe("Matematika Tingkat Lanjut");
    expect(dto.subjectCode).toBe("MATH-101");
    expect(dto.room).toBe("Lab Komputer A");
    expect(dto.instructor).toBe("Dr. Budi Santoso");
    expect(dto.classGroup).toBe("Kelas XII IPA 1");
    expect(dto.status).toBe("SCHEDULED");
    expect(dto.detailRoute).toBe("/dashboard/exams/10");
    expect(dto.description).toBe("Membawa kalkulator saintifik.");
  });
});
