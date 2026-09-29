import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { UserGradeReportResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import GradeReportSummaryCard from "../../molecules/GradeReportSummaryCard";

describe("GradeReportSummaryCard", () => {
  const mockReport: UserGradeReportResponseDto = {
    courseId: 2,
    userId: 101,
    userFullName: "Budi Pratama",
    courseTotal: {
      id: 99,
      itemName: "Total Nilai",
      itemType: "course",
      itemModule: null,
      itemInstance: null,
      gradeRaw: 85,
      gradeFormatted: "85.00",
      gradeMin: 0,
      gradeMax: 100,
      gradePass: 70,
      percentageFormatted: "85%",
      feedback: null,
      isPassed: true,
    },
    items: [
      {
        id: 1,
        itemName: "Quiz 1",
        itemType: "mod",
        itemModule: "quiz",
        itemInstance: 1,
        gradeRaw: 85,
        gradeFormatted: "85.00",
        gradeMin: 0,
        gradeMax: 100,
        gradePass: 70,
        percentageFormatted: "85%",
        feedback: null,
        isPassed: true,
      },
    ],
  };

  it("renders user fullname, course title, and final course grade", () => {
    const html = renderToStaticMarkup(
      <GradeReportSummaryCard report={mockReport} courseTitle="Fisika Dasar" />,
    );
    expect(html).toContain("Budi Pratama");
    expect(html).toContain("Fisika Dasar");
    expect(html).toContain("85.00");
    expect(html).toContain("1 / 1");
  });
});
