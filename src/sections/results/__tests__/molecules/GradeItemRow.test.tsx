import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { GradeItemResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import GradeItemRow from "@/sections/results/molecules/GradeItemRow";

describe("GradeItemRow", () => {
  const mockItem: GradeItemResponseDto = {
    id: 10,
    itemName: "Kuis Harian 1",
    itemType: "mod",
    itemModule: "quiz",
    itemInstance: 2,
    gradeRaw: 90,
    gradeFormatted: "90.00",
    gradeMin: 0,
    gradeMax: 100,
    gradePass: 75,
    percentageFormatted: "90%",
    feedback: "Kerja bagus!",
    isPassed: true,
  };

  it("renders item name, score, feedback, and passed status", () => {
    const html = renderToStaticMarkup(<GradeItemRow item={mockItem} />);
    expect(html).toContain("Kuis Harian 1");
    expect(html).toContain("90.00");
    expect(html).toContain("/ 100");
    expect(html).toContain("Kerja bagus!");
    expect(html).toContain("Lulus");
  });
});
