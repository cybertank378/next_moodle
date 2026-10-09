import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import QuestionNavigator from "@/sections/exam/molecules/QuestionNavigator";

describe("QuestionNavigator", () => {
  const sampleQuestions = [
    { slot: 1, isAnswered: true, isFlagged: false },
    { slot: 2, isAnswered: false, isFlagged: true },
    { slot: 3, isAnswered: false, isFlagged: false },
  ];

  it("renders navigator header and question count summary", () => {
    const html = renderToStaticMarkup(
      <QuestionNavigator
        questions={sampleQuestions}
        currentSlot={1}
        onSelectSlot={vi.fn()}
      />,
    );

    expect(html).toContain("Navigasi Soal");
    expect(html).toContain("1 / 3 Terjawab");
  });

  it("renders buttons for all question slots", () => {
    const html = renderToStaticMarkup(
      <QuestionNavigator
        questions={sampleQuestions}
        currentSlot={2}
        onSelectSlot={vi.fn()}
      />,
    );

    expect(html).toContain("Pindah ke soal nomor 1");
    expect(html).toContain("Pindah ke soal nomor 2");
    expect(html).toContain("Pindah ke soal nomor 3");
  });

  it("renders flag indicator for flagged slots", () => {
    const html = renderToStaticMarkup(
      <QuestionNavigator
        questions={sampleQuestions}
        currentSlot={1}
        onSelectSlot={vi.fn()}
      />,
    );

    expect(html).toContain("nav-flag-2");
  });

  it("renders legend counts accurately", () => {
    const html = renderToStaticMarkup(
      <QuestionNavigator
        questions={sampleQuestions}
        currentSlot={1}
        onSelectSlot={vi.fn()}
      />,
    );

    expect(html).toContain("Sudah Dijawab");
    expect(html).toContain("Belum Dijawab");
    expect(html).toContain("Ditandai / Ragu");
  });
});
