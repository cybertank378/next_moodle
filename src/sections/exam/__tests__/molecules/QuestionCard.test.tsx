import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import QuestionCard from "@/sections/exam/molecules/QuestionCard";

describe("QuestionCard", () => {
  it("renders question number, bobot, and question HTML content", () => {
    const html = renderToStaticMarkup(
      <QuestionCard
        question={{
          slot: 3,
          number: 3,
          maxMark: 2,
          html: "<p>Berapakah hasil dari 2 + 2?</p>",
        }}
        onAnswerChange={vi.fn()}
      />,
    );

    expect(html).toContain("Soal Nomor 3");
    expect(html).toContain("Bobot: 2 Poin");
    expect(html).toContain("Berapakah hasil dari 2 + 2?");
  });

  it("renders answer option labels A, B, C, D, E", () => {
    const html = renderToStaticMarkup(
      <QuestionCard
        question={{
          slot: 1,
          number: 1,
        }}
        currentAnswer="2"
        onAnswerChange={vi.fn()}
      />,
    );

    expect(html).toContain("Pilihan A");
    expect(html).toContain("Pilihan B");
    expect(html).toContain("Pilihan C");
    expect(html).toContain("Pilihan D");
    expect(html).toContain("Pilihan E");
  });

  it("renders flag button with correct state", () => {
    const htmlUnflagged = renderToStaticMarkup(
      <QuestionCard
        question={{ slot: 1 }}
        isFlagged={false}
        onAnswerChange={vi.fn()}
        onToggleFlag={vi.fn()}
      />,
    );
    expect(htmlUnflagged).toContain("Tandai Soal");

    const htmlFlagged = renderToStaticMarkup(
      <QuestionCard
        question={{ slot: 1 }}
        isFlagged={true}
        onAnswerChange={vi.fn()}
        onToggleFlag={vi.fn()}
      />,
    );
    expect(htmlFlagged).toContain("Ditandai Ragu");
  });
});
