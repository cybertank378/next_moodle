import { describe, expect, it } from "vitest";
import { CalendarEventEntity } from "@/modules/calendar/domain/entity/CalendarEventEntity";
import { CalendarEventMapper } from "@/modules/calendar/domain/mapper/CalendarEventMapper";

describe("CalendarEventMapper", () => {
  it("maps CalendarEventEntity to CalendarEventItemDTO properly", () => {
    const entity = new CalendarEventEntity("quiz-10", "tenant-1", {
      id: "quiz-10",
      sourceType: "QUIZ_EXAM",
      title: "Ujian Akhir Semester Fisika",
      startAt: "2026-10-15T08:00:00.000Z",
      endAt: "2026-10-15T10:00:00.000Z",
      allDay: false,
      courseId: 101,
      courseName: "Fisika Dasar",
      relatedResourceId: 10,
      description: "Ujian fisika dasar semester ganjil",
      status: "OPEN",
      detailRoute: "/dashboard/exams/10",
      timezone: "Asia/Jakarta",
    });

    const dto = CalendarEventMapper.toDTO(entity);

    expect(dto.id).toBe("quiz-10");
    expect(dto.sourceType).toBe("QUIZ_EXAM");
    expect(dto.title).toBe("Ujian Akhir Semester Fisika");
    expect(dto.startAt).toBe("2026-10-15T08:00:00.000Z");
    expect(dto.endAt).toBe("2026-10-15T10:00:00.000Z");
    expect(dto.allDay).toBe(false);
    expect(dto.courseId).toBe(101);
    expect(dto.courseName).toBe("Fisika Dasar");
    expect(dto.relatedResourceId).toBe(10);
    expect(dto.detailRoute).toBe("/dashboard/exams/10");
  });
});
