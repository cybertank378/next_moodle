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

  it("renders textarea input when question type is essay", () => {
    const html = renderToStaticMarkup(
      <QuestionCard
        question={{
          slot: 2,
          type: "essay",
          number: 2,
          html: "<p>Jelaskan proses fotosintesis!</p>",
        }}
        currentAnswer="Jawaban esai saya"
        onAnswerChange={vi.fn()}
      />,
    );

    expect(html).toContain("Jawaban Esai");
    expect(html).toContain("data-testid=\"essay-2\"");
    expect(html).toContain("Jawaban esai saya");
  });

  it("renders text input when question type is shortanswer", () => {
    const html = renderToStaticMarkup(
      <QuestionCard
        question={{
          slot: 4,
          type: "shortanswer",
          number: 4,
          html: "<p>Ibukota Indonesia?</p>",
        }}
        currentAnswer="Nusantara"
        onAnswerChange={vi.fn()}
      />,
    );

    expect(html).toContain("Jawaban Singkat");
    expect(html).toContain("data-testid=\"shortanswer-4\"");
    expect(html).toContain("Nusantara");
  });
});
