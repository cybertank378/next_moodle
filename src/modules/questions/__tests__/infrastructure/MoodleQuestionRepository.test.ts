import { describe, expect, it, vi } from "vitest";
import type { MoodleClient } from "@/core/moodle/types";
import { QuestionType } from "@/modules/questions/domain/types/QuestionTypes";
import { MoodleQuestionRepository } from "@/modules/questions/infrastructure/repo/MoodleQuestionRepository";

describe("MoodleQuestionRepository", () => {
  it("fetches questions by category handling Moodle envelope response and categoryid mapping", async () => {
    const mockClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        total: 1,
        page: 1,
        limit: 20,
        questions: [
          {
            id: 201,
            name: "Pertanyaan Pilihan Ganda",
            categoryid: 15,
            qtype: "multichoice",
            status: "ready",
            defaultmark: 2.0,
            timecreated: 1700000000,
            timemodified: 1700003600,
            version: 1,
          },
        ],
      }),
    };

    const repo = new MoodleQuestionRepository();
    const questions = await repo.getQuestionsByCategory(mockClient, 15);

    expect(mockClient.call).toHaveBeenCalledWith(
      "local_examapi_get_questions",
      {
        categoryid: 15,
      },
    );
    expect(questions).toHaveLength(1);
    expect(questions[0].id).toBe(201);
    expect(questions[0].categoryId).toBe(15);
    expect(questions[0].name).toBe("Pertanyaan Pilihan Ganda");
    expect(questions[0].defaultMark).toBe(2.0);
  });

  it("creates question passing options_json parameter and mapping categoryid", async () => {
    const mockClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        id: 301,
        name: "Pertanyaan Baru",
        categoryid: 15,
        qtype: "multichoice",
        status: "ready",
        defaultmark: 1.0,
        timecreated: 1700000000,
        timemodified: 1700000000,
        version: 1,
      }),
    };

    const repo = new MoodleQuestionRepository();
    const question = await repo.createQuestion(mockClient, {
      categoryId: 15,
      type: QuestionType.MULTICHOICE,
      name: "Pertanyaan Baru",
      questionText: "Berapa 1 + 1?",
      defaultMark: 1.0,
      options: [
        { text: "2", fraction: 100 },
        { text: "3", fraction: 0 },
      ],
    });

    expect(mockClient.call).toHaveBeenCalledWith(
      "local_examapi_create_question",
      {
        categoryid: 15,
        qtype: "multichoice",
        name: "Pertanyaan Baru",
        questiontext: "Berapa 1 + 1?",
        defaultmark: 1.0,
        options_json: JSON.stringify([
          { text: "2", fraction: 100 },
          { text: "3", fraction: 0 },
        ]),
      },
    );
    expect(question.id).toBe(301);
    expect(question.categoryId).toBe(15);
  });

  it("updates question passing options_json and checking return structure", async () => {
    const mockClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        success: true,
        questionid: 301,
        timemodified: 1700005000,
        version: 2,
      }),
    };

    const repo = new MoodleQuestionRepository();
    const updated = await repo.updateQuestion(mockClient, 301, {
      name: "Pertanyaan Diperbarui",
      defaultMark: 3.0,
      options: [{ text: "Benar", fraction: 100 }],
    });

    expect(mockClient.call).toHaveBeenCalledWith(
      "local_examapi_update_question",
      {
        questionid: 301,
        name: "Pertanyaan Diperbarui",
        defaultmark: 3.0,
        options_json: JSON.stringify([{ text: "Benar", fraction: 100 }]),
      },
    );
    expect(updated.id).toBe(301);
    expect(updated.name).toBe("Pertanyaan Diperbarui");
    expect(updated.defaultMark).toBe(3.0);
  });

  it("deletes question by calling local_examapi_delete_question", async () => {
    const mockClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        success: true,
        questionid: 301,
      }),
    };

    const repo = new MoodleQuestionRepository();
    await repo.deleteQuestion(mockClient, 301);

    expect(mockClient.call).toHaveBeenCalledWith(
      "local_examapi_delete_question",
      {
        questionid: 301,
      },
    );
  });
});
