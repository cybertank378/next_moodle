import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { UserGradeReportResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import CourseGradesTable from "../../molecules/CourseGradesTable";

describe("CourseGradesTable", () => {
  it("renders empty state when reports array is empty", () => {
    const html = renderToStaticMarkup(<CourseGradesTable reports={[]} />);
    expect(html).toContain("Belum ada rekap nilai peserta yang tersedia");
  });

  it("renders student rows with names and total scores", () => {
    const mockReports: UserGradeReportResponseDto[] = [
      {
        courseId: 1,
        userId: 201,
        userFullName: "Citra Lestari",
        courseTotal: {
          id: 50,
          itemName: "Total",
          itemType: "course",
          itemModule: null,
          itemInstance: null,
          gradeRaw: 92,
          gradeFormatted: "92.00",
          gradeMin: 0,
          gradeMax: 100,
          gradePass: 75,
          percentageFormatted: "92%",
          feedback: null,
          isPassed: true,
        },
        items: [],
      },
    ];

    const html = renderToStaticMarkup(
      <CourseGradesTable reports={mockReports} onSelectStudent={() => {}} />,
    );
    expect(html).toContain("Citra Lestari");
    expect(html).toContain("#201");
    expect(html).toContain("92.00");
    expect(html).toContain("Rapor");
  });
});
