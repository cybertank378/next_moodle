import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import CourseDetailView from "@/sections/courses/organisms/CourseDetailView";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockCourseData = {
  course: {
    id: 101,
    shortName: "MATH101",
    fullName: "Matematika Dasar 101",
    displayName: "Matematika Dasar 101",
    idNumber: "MATH-101",
    summary: "<p>Kalkulus dan Aljabar Linier</p>",
    format: "topics",
    startDate: 1700000000,
    endDate: null,
    categoryId: 2,
    progress: 40,
    isCompleted: false,
    imageUrl: null,
  },
  sections: [
    {
      id: 1,
      name: "Bab 1: Persamaan Linier",
      sectionNumber: 1,
      summary: "Pengenalan persamaan",
      isVisible: true,
      modules: [
        {
          id: 10,
          name: "Kuis Bab 1",
          modName: "quiz",
          instance: 5,
          url: null,
        },
        {
          id: 11,
          name: "Modul PDF",
          modName: "resource",
          instance: 6,
          url: "https://example.com/file.pdf",
        },
      ],
    },
  ],
};

vi.mock("@/modules/course/presentation/hooks/useCourseApi", () => ({
  useCourseApi: () => ({
    detailState: {
      data: mockCourseData,
      loading: false,
      error: null,
    },
    getCourseDetail: vi.fn(),
  }),
}));

vi.mock("@/modules/quiz/presentation/hooks/useQuizApi", () => ({
  useQuizApi: () => ({
    quizzesState: {
      data: {
        quizzes: [
          {
            id: 5,
            courseId: 101,
            name: "Kuis Bab 1",
            intro: "Kuis materi 1",
            timeLimitSeconds: 1800,
            timeOpen: 1700000000,
            timeClose: null,
            attemptsAllowed: 1,
          },
        ],
        total: 1,
      },
      loading: false,
      error: null,
    },
    listQuizzes: vi.fn(),
  }),
}));

vi.mock("@/modules/grades/presentation/hooks/useGradeApi", () => ({
  useGradeApi: () => ({
    userReportState: {
      data: null,
      loading: false,
      error: null,
    },
    getUserGradeReport: vi.fn(),
  }),
}));

describe("CourseDetailView Role Adaptations", () => {
  it("renders teacher controls and role badge when userRole is TEACHER", () => {
    const html = renderToStaticMarkup(
      <CourseDetailView courseId={101} userRole="TEACHER" />,
    );

    expect(html).toContain("Akses Pengajar");
    expect(html).toContain("Guru Pengampu");
    expect(html).toContain("Kelola Ujian &amp; Kuis");
    expect(html).not.toContain("Kemajuan Belajar");
  });

  it("renders student learning progress when userRole is STUDENT", () => {
    const html = renderToStaticMarkup(
      <CourseDetailView courseId={101} userRole="STUDENT" />,
    );

    expect(html).toContain("Kemajuan Belajar");
    expect(html).toContain("40%");
    expect(html).not.toContain("Guru Pengampu");
  });
});
