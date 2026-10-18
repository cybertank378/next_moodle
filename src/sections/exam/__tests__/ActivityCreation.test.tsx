import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ActivityTypeSelector from "@/sections/exam/molecules/ActivityTypeSelector";
import BankSoalQuestionRow from "@/sections/exam/molecules/BankSoalQuestionRow";

describe("ActivityCreation UI Components", () => {
  describe("ActivityTypeSelector", () => {
    it("should render all three activity options", () => {
      const handleChange = vi.fn();
      const html = renderToStaticMarkup(
        <ActivityTypeSelector activeType="quiz" onChange={handleChange} />,
      );

      expect(html).toContain("Kuis &amp; Ujian");
      expect(html).toContain("Materi Belajar");
      expect(html).toContain("Tugas Mandiri");
      expect(html).toContain("Pilih Jenis Aktivitas Pembelajaran");
    });
  });

  describe("BankSoalQuestionRow", () => {
    it("should render question details and type badge", () => {
      const handleToggle = vi.fn();
      const mockQuestion = {
        id: 10,
        categoryId: 1,
        type: "multichoice",
        name: "Pertanyaan Matematika 1",
        questionText: "<p>Berapa 10 + 20?</p>",
        defaultMark: 2,
      };

      const html = renderToStaticMarkup(
        <BankSoalQuestionRow
          question={mockQuestion}
          isSelected={true}
          onToggle={handleToggle}
        />,
      );

      expect(html).toContain("Pertanyaan Matematika 1");
      expect(html).toContain("Pilihan Ganda");
      expect(html).toContain("Bobot: 2 poin");
      expect(html).toContain("Berapa 10 + 20?");
    });
  });
});
