import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GradeScoreCard from "@/sections/results/atoms/GradeScoreCard";

describe("GradeScoreCard", () => {
  it("renders label, value, and subLabel correctly", () => {
    const html = renderToStaticMarkup(
      <GradeScoreCard
        label="Nilai Rata-rata"
        value="88.5"
        subLabel="dari 100 poin"
        variant="success"
      />,
    );
    expect(html).toContain("Nilai Rata-rata");
    expect(html).toContain("88.5");
    expect(html).toContain("dari 100 poin");
    expect(html).toContain("grade-score-card");
  });
});
