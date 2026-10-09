import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { QuizSummaryResponseDTO } from "@/modules/quiz/domain/dto/QuizResponseDto";
import QuizStatusBadge from "@/sections/exam/atoms/QuizStatusBadge";
import QuizTimeLimitBadge from "@/sections/exam/atoms/QuizTimeLimitBadge";
import QuizCard from "@/sections/exam/molecules/QuizCard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("Quiz Components", () => {
  const sampleQuiz: QuizSummaryResponseDTO = {
    id: 10,
    courseId: 2,
    courseModuleId: 20,
    name: "Ujian Akhir Semester Fisika",
    intro: "<p>Ujian mengenai Termodinamika dan Mekanika.</p>",
    timeOpen: 1700000000,
    timeClose: 1700003600,
    timeLimitSeconds: 5400,
    maxAttempts: 1,
    grade: 100,
    isVisible: true,
    status: "OPEN",
  };

  describe("QuizStatusBadge", () => {
    it("renders Aktif / Terbuka for OPEN status", () => {
      const html = renderToStaticMarkup(<QuizStatusBadge status="OPEN" />);
      expect(html).toContain("Aktif / Terbuka");
    });

    it("renders Akan Datang for UPCOMING status", () => {
      const html = renderToStaticMarkup(<QuizStatusBadge status="UPCOMING" />);
      expect(html).toContain("Akan Datang");
    });

    it("renders Ditutup for CLOSED status", () => {
      const html = renderToStaticMarkup(<QuizStatusBadge status="CLOSED" />);
      expect(html).toContain("Ditutup");
    });
  });

  describe("QuizTimeLimitBadge", () => {
    it("renders minutes for positive duration", () => {
      const html = renderToStaticMarkup(<QuizTimeLimitBadge seconds={3600} />);
      expect(html).toContain("60 Menit");
    });

    it("renders Tanpa Batas Waktu for 0", () => {
      const html = renderToStaticMarkup(<QuizTimeLimitBadge seconds={0} />);
      expect(html).toContain("Tanpa Batas Waktu");
    });
  });

  describe("QuizCard", () => {
    it("renders quiz information, badges, and action button", () => {
      const html = renderToStaticMarkup(<QuizCard quiz={sampleQuiz} />);

      expect(html).toContain("Ujian Akhir Semester Fisika");
      expect(html).toContain("Ujian mengenai Termodinamika dan Mekanika.");
      expect(html).toContain("Aktif / Terbuka");
      expect(html).toContain("90 Menit");
      expect(html).toContain("Detail &amp; Akses Ujian");
    });
  });
});
