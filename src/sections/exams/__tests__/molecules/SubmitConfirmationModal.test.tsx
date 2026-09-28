import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import SubmitConfirmationModal from "../../molecules/SubmitConfirmationModal";

describe("SubmitConfirmationModal", () => {
  it("renders null when isOpen is false", () => {
    const html = renderToStaticMarkup(
      <SubmitConfirmationModal
        isOpen={false}
        onClose={vi.fn()}
        onConfirmSubmit={vi.fn()}
        totalQuestions={10}
        answeredCount={10}
      />,
    );

    expect(html).toBe("");
  });

  it("renders modal dialog when isOpen is true", () => {
    const html = renderToStaticMarkup(
      <SubmitConfirmationModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirmSubmit={vi.fn()}
        totalQuestions={10}
        answeredCount={10}
      />,
    );

    expect(html).toContain("Kumpulkan Ujian?");
    expect(html).toContain("Kumpulkan Sekarang");
    expect(html).toContain("Kembali Periksa");
  });

  it("shows warning when there are unanswered questions", () => {
    const html = renderToStaticMarkup(
      <SubmitConfirmationModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirmSubmit={vi.fn()}
        totalQuestions={10}
        answeredCount={7}
      />,
    );

    expect(html).toContain("Perhatian: Soal Belum Lengkap");
    expect(html).toContain("3");
  });

  it("shows offline warning when isOffline is true", () => {
    const html = renderToStaticMarkup(
      <SubmitConfirmationModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirmSubmit={vi.fn()}
        totalQuestions={10}
        answeredCount={10}
        isOffline={true}
      />,
    );

    expect(html).toContain("Koneksi Internet Terputus (Offline)");
  });
});
