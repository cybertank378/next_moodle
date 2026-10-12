import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { CalendarEventItemDTO } from "@/modules/calendar/domain/dto/CalendarResponseDTO";
import { CalendarDayDot } from "@/sections/calendar/atoms/CalendarDayDot";
import { CalendarEventBadge } from "@/sections/calendar/atoms/CalendarEventBadge";
import { CalendarEventCard } from "@/sections/calendar/molecules/CalendarEventCard";

describe("Calendar UI Components", () => {
  it("renders CalendarEventBadge correctly for different event types", () => {
    const htmlQuiz = renderToStaticMarkup(
      <CalendarEventBadge type="QUIZ_EXAM" />,
    );
    expect(htmlQuiz).toContain("Ujian / Kuis");

    const htmlCourse = renderToStaticMarkup(
      <CalendarEventBadge type="COURSE_CLASS" />,
    );
    expect(htmlCourse).toContain("Jadwal Pelajaran");
  });

  it("renders CalendarDayDot with dots and count", () => {
    const events: CalendarEventItemDTO[] = [
      {
        id: "1",
        sourceType: "QUIZ_EXAM",
        title: "Ev 1",
        startAt: "2026-10-15T08:00:00Z",
        allDay: false,
      },
      {
        id: "2",
        sourceType: "QUIZ_EXAM",
        title: "Ev 2",
        startAt: "2026-10-15T09:00:00Z",
        allDay: false,
      },
      {
        id: "3",
        sourceType: "QUIZ_EXAM",
        title: "Ev 3",
        startAt: "2026-10-15T10:00:00Z",
        allDay: false,
      },
      {
        id: "4",
        sourceType: "QUIZ_EXAM",
        title: "Ev 4",
        startAt: "2026-10-15T11:00:00Z",
        allDay: false,
      },
    ];

    const html = renderToStaticMarkup(
      <CalendarDayDot events={events} maxDisplay={3} />,
    );
    expect(html).toContain("+1");
  });

  it("renders CalendarEventCard with title, course, and link", () => {
    const event: CalendarEventItemDTO = {
      id: "quiz-1",
      sourceType: "QUIZ_EXAM",
      title: "Ujian Fisika",
      courseName: "Fisika Dasar",
      startAt: "2026-10-15T08:00:00Z",
      endAt: "2026-10-15T10:00:00Z",
      allDay: false,
      detailRoute: "/dashboard/exams/1",
    };

    const html = renderToStaticMarkup(<CalendarEventCard event={event} />);
    expect(html).toContain("Ujian Fisika");
    expect(html).toContain("Fisika Dasar");
    expect(html).toContain("Lihat Detail");
  });
});
