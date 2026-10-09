// Files: src/sections/questions/__tests__/QuestionEditor.test.tsx

import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestionType } from "@/modules/questions/domain/types/QuestionTypes";
import * as questionHook from "@/modules/questions/presentation/hooks/useQuestionApi";
import { QuestionEditor } from "@/sections/questions/organisms/QuestionEditor";

vi.mock("@/modules/questions/presentation/hooks/useQuestionApi", () => ({
  useQuestionApi: vi.fn(),
}));

describe("QuestionEditor", () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(questionHook.useQuestionApi).mockReturnValue({
      createQuestion: vi.fn(),
      updateQuestion: vi.fn(),
      loading: false,
    });
  });

  it("should render create question form properly", () => {
    const html = renderToStaticMarkup(
      <QuestionEditor categoryId={1} onSuccess={mockOnSuccess} />,
    );

    expect(html).toContain("Create New Question");
    expect(html).toContain("Question Name");
    expect(html).toContain("Question Text");
    expect(html).toContain("Save Question");
  });

  it("should render edit question form with existing question values", () => {
    const existingQuestion = {
      id: 42,
      name: "Soal Matematika 1",
      questionText: "<p>Berapakah 2 + 2?</p>",
      type: QuestionType.MULTICHOICE,
      defaultMark: 2,
      options: [],
    };

    const html = renderToStaticMarkup(
      <QuestionEditor
        categoryId={1}
        existingQuestion={existingQuestion}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(html).toContain("Edit Question");
    expect(html).toContain("Soal Matematika 1");
    expect(html).toContain("Update Question");
  });

  it("should render edit question form preserving LaTeX math equation markers", () => {
    const existingQuestion = {
      id: 43,
      name: "Soal Persamaan Kuadrat",
      questionText:
        '<p>Selesaikan persamaan <span data-type="inline-math" data-latex="x^2 + 5x + 6 = 0"></span> berikut:</p>' +
        '<div data-type="block-math" data-latex="x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"></div>',
      type: QuestionType.MULTICHOICE,
      defaultMark: 3,
      options: [],
    };

    const html = renderToStaticMarkup(
      <QuestionEditor
        categoryId={1}
        existingQuestion={existingQuestion}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(html).toContain("Soal Persamaan Kuadrat");
    expect(html).toContain("Update Question");
  });
});
