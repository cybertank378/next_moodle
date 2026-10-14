import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ExamCompleteModal from "@/sections/exam/molecules/ExamCompleteModal";

describe("ExamCompleteModal", () => {
  it("renders null when isOpen is false", () => {
    const html = renderToStaticMarkup(
      <ExamCompleteModal
        isOpen={false}
        attemptId={10}
        onBackToExams={vi.fn()}
      />,
    );

    expect(html).toBe("");
  });

  it("renders completion details and actions when isOpen is true", () => {
    const html = renderToStaticMarkup(
      <ExamCompleteModal
        isOpen={true}
        attemptId={501}
        quizName="Ujian Biologi"
        onBackToExams={vi.fn()}
        onViewResults={vi.fn()}
      />,
    );

    expect(html).toContain("Ujian Telah Selesai Dikirim");
    expect(html).toContain("Ujian Biologi");
    expect(html).toContain("Attempt #501");
    expect(html).toContain("Kembali ke Portal Ujian");
    expect(html).toContain("Lihat Daftar Nilai");
  });
});
