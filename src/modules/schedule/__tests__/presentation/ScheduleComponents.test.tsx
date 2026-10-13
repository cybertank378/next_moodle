import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { ScheduleSessionItemDTO } from "@/modules/schedule/domain/dto/ScheduleResponseDTO";
import { ScheduleStatusBadge } from "@/sections/schedule/atoms/ScheduleStatusBadge";
import { ScheduleTypeBadge } from "@/sections/schedule/atoms/ScheduleTypeBadge";
import { ScheduleSessionCard } from "@/sections/schedule/molecules/ScheduleSessionCard";
import { ScheduleToolbar } from "@/sections/schedule/molecules/ScheduleToolbar";

describe("Schedule UI Components", () => {
  it("renders badges correctly for session types and statuses", () => {
    const examBadgeHtml = renderToStaticMarkup(
      <ScheduleTypeBadge type="EXAM" />,
    );
    expect(examBadgeHtml).toContain("Ujian / Kuis");

    const lessonBadgeHtml = renderToStaticMarkup(
      <ScheduleTypeBadge type="LESSON" />,
    );
    expect(lessonBadgeHtml).toContain("Pelajaran");

    const scheduledStatusHtml = renderToStaticMarkup(
      <ScheduleStatusBadge status="SCHEDULED" />,
    );
    expect(scheduledStatusHtml).toContain("Terjadwal");

    const inProgressStatusHtml = renderToStaticMarkup(
      <ScheduleStatusBadge status="IN_PROGRESS" />,
    );
    expect(inProgressStatusHtml).toContain("Sedang Berlangsung");
  });

  it("renders ScheduleSessionCard without any ul, ol, or li tags", () => {
    const session: ScheduleSessionItemDTO = {
      id: "quiz-1",
      sessionType: "EXAM",
      title: "Ujian Akhir Semester Fisika",
      startsAt: "2026-10-20T08:00:00.000Z",
      endsAt: "2026-10-20T10:00:00.000Z",
      allDay: false,
      courseId: 5,
      courseName: "Fisika Dasar",
      subjectCode: "FIS-101",
      room: "Ruang 204",
      instructor: "Pak Bambang",
      status: "SCHEDULED",
      detailRoute: "/dashboard/exams/1",
    };

    const html = renderToStaticMarkup(<ScheduleSessionCard session={session} />);

    expect(html).toContain("Ujian Akhir Semester Fisika");
    expect(html).toContain("Fisika Dasar");
    expect(html).toContain("FIS-101");
    expect(html).toContain("Ruang: Ruang 204");
    expect(html).toContain("Pengajar: Pak Bambang");

    // Verify hard constraint: NO ul, ol, or li tags
    expect(html).not.toContain("<ul");
    expect(html).not.toContain("<ol");
    expect(html).not.toContain("<li");
  });

  it("renders ScheduleToolbar without ul, ol, or li tags", () => {
    const html = renderToStaticMarkup(
      <ScheduleToolbar
        currentDateRangeLabel="13 Okt - 19 Okt 2026"
        onPrev={() => {}}
        onNext={() => {}}
        onToday={() => {}}
        viewMode="week"
        onViewModeChange={() => {}}
        search=""
        onSearchChange={() => {}}
        selectedTypes={["EXAM"]}
        onToggleType={() => {}}
      />,
    );

    expect(html).toContain("13 Okt - 19 Okt 2026");
    expect(html).not.toContain("<ul");
    expect(html).not.toContain("<ol");
    expect(html).not.toContain("<li");
  });
});
