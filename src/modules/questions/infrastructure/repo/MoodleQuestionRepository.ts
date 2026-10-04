import { MoodleError } from "@/core/errors/MoodleError";
import type { MoodleClient } from "@/core/moodle/types";
import { QuestionEntity } from "@/modules/questions/domain/entity/QuestionEntity";
import type { QuestionRepositoryInterface } from "@/modules/questions/domain/interfaces/QuestionRepositoryInterface";
import type {
  CreateQuestionRequestDto,
  UpdateQuestionRequestDto,
} from "@/modules/questions/domain/types/QuestionTypes";

export class MoodleQuestionRepository implements QuestionRepositoryInterface {
  async getQuestionsByCategory(
    client: MoodleClient,
    categoryId: number,
  ): Promise<QuestionEntity[]> {
    const res = await client.call<any[]>("local_examapi_get_questions", {
      categoryid: categoryId,
    });
    if (!res || !Array.isArray(res)) {
      throw new MoodleError(
        "Invalid response from local_examapi_get_questions",
      );
    }
    return res.map(
      (q: any) =>
        new QuestionEntity(q.id, {
          categoryId: q.category,
          type: q.qtype,
          name: q.name,
          questionText: q.questiontext,
          defaultMark: q.defaultmark,
          options: [],
          createdAt: new Date(q.timecreated * 1000),
          updatedAt: new Date(q.timemodified * 1000),
        }),
    );
  }

  async createQuestion(
    client: MoodleClient,
    dto: CreateQuestionRequestDto,
  ): Promise<QuestionEntity> {
    const res = await client.call<any>("local_examapi_create_question", {
      categoryid: dto.categoryId,
      qtype: dto.type,
      name: dto.name,
      questiontext: dto.questionText,
      defaultmark: dto.defaultMark,
      options: dto.options ? JSON.stringify(dto.options) : "[]",
    });

    if (!res || !res.id) {
      throw new MoodleError("Failed to create question");
    }

    return new QuestionEntity(res.id, {
      categoryId: res.category,
      type: res.qtype,
      name: res.name,
      questionText: res.questiontext,
      defaultMark: res.defaultmark,
      options: dto.options,
      createdAt: new Date(res.timecreated * 1000),
      updatedAt: new Date(res.timemodified * 1000),
    });
  }

  async deleteQuestion(
    client: MoodleClient,
    questionId: number,
  ): Promise<void> {
    await client.call("local_examapi_delete_question", {
      questionid: questionId,
    });
  }

  async updateQuestion(
    client: MoodleClient,
    questionId: number,
    dto: UpdateQuestionRequestDto,
  ): Promise<QuestionEntity> {
    const args: any = { questionid: questionId };
    if (dto.name !== undefined) args.name = dto.name;
    if (dto.questionText !== undefined) args.questiontext = dto.questionText;
    if (dto.defaultMark !== undefined) args.defaultmark = dto.defaultMark;
    if (dto.options !== undefined) args.options = JSON.stringify(dto.options);

    const res = await client.call<any>("local_examapi_update_question", args);

    if (!res || !res.id) {
      throw new MoodleError("Failed to update question");
    }

    return new QuestionEntity(res.id, {
      categoryId: res.category,
      type: res.qtype,
      name: res.name,
      questionText: res.questiontext,
      defaultMark: res.defaultmark,
      options: dto.options || [],
      createdAt: new Date(res.timecreated * 1000),
      updatedAt: new Date(res.timemodified * 1000),
    });
  }
}
