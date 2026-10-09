import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ExamAttemptInterface from "@/sections/exam/organisms/ExamAttemptInterface";

describe("ExamAttemptInterface", () => {
  const sampleQuestions = [
    { slot: 1, number: 1, html: "<p>Pertanyaan 1</p>" },
    { slot: 2, number: 2, html: "<p>Pertanyaan 2</p>" },
  ];

  it("renders exam attempt interface with quiz header, timer, and question card", () => {
    const html = renderToStaticMarkup(
      <ExamAttemptInterface
        attemptId={501}
        quizId={10}
        quizName="Ujian Matematika Dasar"
        questions={sampleQuestions}
        onFinalSubmit={vi.fn()}
        onSaveAnswer={vi.fn().mockResolvedValue(true)}
      />,
    );

    expect(html).toContain("Ujian Matematika Dasar");
    expect(html).toContain("Attempt #501");
    expect(html).toContain("Soal Nomor 1");
    expect(html).toContain("Pertanyaan 1");
    expect(html).toContain("Navigasi Soal");
    expect(html).toContain("Selesaikan Ujian");
  });
});
