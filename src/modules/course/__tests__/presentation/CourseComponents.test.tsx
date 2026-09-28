import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { CourseSummaryResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import CourseCategoryBadge from "@/sections/courses/atoms/CourseCategoryBadge";
import CourseProgressBadge from "@/sections/courses/atoms/CourseProgressBadge";
import CourseCard from "@/sections/courses/molecules/CourseCard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("Course Components", () => {
  const sampleCourse: CourseSummaryResponseDTO = {
    id: 101,
    shortName: "BIO101",
    fullName: "Biology 101",
    displayName: "General Biology 101",
    idNumber: "BIO-101",
    summary: "<p>Learn fundamental biology concepts.</p>",
    format: "topics",
    startDate: 1700000000,
    endDate: null,
    categoryId: 2,
    progress: 75,
    isCompleted: false,
    imageUrl: null,
  };

  describe("CourseProgressBadge", () => {
    it("renders percentage when not completed", () => {
      const html = renderToStaticMarkup(
        <CourseProgressBadge progress={75} isCompleted={false} />,
      );
      expect(html).toContain("75%");
    });

    it("renders Selesai badge when isCompleted is true", () => {
      const html = renderToStaticMarkup(
        <CourseProgressBadge progress={100} isCompleted={true} />,
      );
      expect(html).toContain("Selesai");
    });

    it("renders Belum Dimulai when progress is 0 or null", () => {
      const html = renderToStaticMarkup(
        <CourseProgressBadge progress={null} isCompleted={false} />,
      );
      expect(html).toContain("Belum dimulai");
    });
  });

  describe("CourseCategoryBadge", () => {
    it("renders format name correctly", () => {
      const html = renderToStaticMarkup(
        <CourseCategoryBadge format="topics" />,
      );
      expect(html).toContain("topics");
    });
  });

  describe("CourseCard", () => {
    it("renders course details, badges, and Buka Kursus button", () => {
      const html = renderToStaticMarkup(<CourseCard course={sampleCourse} />);

      expect(html).toContain("BIO101");
      expect(html).toContain("General Biology 101");
      expect(html).toContain("Learn fundamental biology concepts.");
      expect(html).toContain("75%");
      expect(html).toContain("Buka Kursus");
    });
  });
});
