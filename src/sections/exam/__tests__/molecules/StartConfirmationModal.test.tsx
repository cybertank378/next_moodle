import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import StartConfirmationModal from "@/sections/exam/molecules/StartConfirmationModal";

describe("StartConfirmationModal", () => {
  it("renders null when isOpen is false", () => {
    const html = renderToStaticMarkup(
      <StartConfirmationModal
        isOpen={false}
        onClose={vi.fn()}
        onConfirmStart={vi.fn()}
        quizName="Ujian Matematika"
      />,
    );

    expect(html).toBe("");
  });

  it("renders dialog when isOpen is true", () => {
    const html = renderToStaticMarkup(
      <StartConfirmationModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirmStart={vi.fn()}
        quizName="Ujian Matematika"
        timeLimitMinutes={90}
        maxAttempts={2}
      />,
    );

    expect(html).toContain("Konfirmasi Mulai Ujian");
    expect(html).toContain("Ujian Matematika");
    expect(html).toContain("Durasi: 90 Menit");
    expect(html).toContain("Batas: 2x Percobaan");
    expect(html).toContain("Mulai Sekarang");
    expect(html).toContain("Batal");
  });
});
