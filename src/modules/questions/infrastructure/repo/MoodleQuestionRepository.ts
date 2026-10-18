// Files: src/modules/questions/infrastructure/repo/MoodleQuestionRepository.ts

import { MoodleError } from "@/core/errors/MoodleError";
import type { MoodleClient } from "@/core/moodle/types";
import { QuestionEntity } from "@/modules/questions/domain/entity/QuestionEntity";
import type { QuestionRepositoryInterface } from "@/modules/questions/domain/interfaces/QuestionRepositoryInterface";
import {
  type CreateQuestionRequestDto,
  QuestionType,
  type UpdateQuestionRequestDto,
} from "@/modules/questions/domain/types/QuestionTypes";

interface MoodleQuestionItem {
  id: number;
  categoryid?: number;
  category?: number;
  qtype: QuestionType;
  name: string;
  questiontext?: string;
  defaultmark?: number;
  timecreated?: number;
  timemodified?: number;
}

interface MoodleGetQuestionsResponse {
  total?: number;
  page?: number;
  limit?: number;
  questions?: MoodleQuestionItem[];
}

interface MoodleUpdateQuestionResponse {
  success?: boolean;
  questionid?: number;
  id?: number;
  timemodified?: number;
  version?: number;
  categoryid?: number;
  category?: number;
  qtype?: QuestionType;
  name?: string;
  questiontext?: string;
  defaultmark?: number;
  timecreated?: number;
}

export class MoodleQuestionRepository implements QuestionRepositoryInterface {
  async getQuestionsByCategory(
    client: MoodleClient,
    categoryId: number,
  ): Promise<QuestionEntity[]> {
    const res = await client.call<
      MoodleGetQuestionsResponse | MoodleQuestionItem[]
    >("local_examapi_get_questions", {
      categoryid: categoryId,
    });
    const rawList: MoodleQuestionItem[] = Array.isArray(res)
      ? res
      : (res?.questions ?? []);

    return rawList.map(
      (q: MoodleQuestionItem) =>
        new QuestionEntity(q.id, {
          categoryId: q.categoryid ?? q.category ?? categoryId,
          type: q.qtype,
          name: q.name,
          questionText: q.questiontext ?? "",
          defaultMark: q.defaultmark ?? 1,
          options: [],
          createdAt: new Date((q.timecreated || 0) * 1000),
          updatedAt: new Date((q.timemodified || 0) * 1000),
        }),
    );
  }

  async createQuestion(
    client: MoodleClient,
    dto: CreateQuestionRequestDto,
  ): Promise<QuestionEntity> {
    const res = await client.call<MoodleQuestionItem>(
      "local_examapi_create_question",
      {
        categoryid: dto.categoryId,
        qtype: dto.type,
        name: dto.name,
        questiontext: dto.questionText,
        defaultmark: dto.defaultMark,
        options_json: dto.options ? JSON.stringify(dto.options) : "{}",
      },
    );

    if (!res?.id) {
      throw new MoodleError("CREATE_FAILED", "Failed to create question");
    }

    return new QuestionEntity(res.id, {
      categoryId: res.categoryid ?? res.category ?? dto.categoryId,
      type: res.qtype ?? dto.type,
      name: res.name ?? dto.name,
      questionText: res.questiontext ?? dto.questionText,
      defaultMark: res.defaultmark ?? dto.defaultMark,
      options: dto.options,
      createdAt: new Date((res.timecreated || Date.now() / 1000) * 1000),
      updatedAt: new Date((res.timemodified || Date.now() / 1000) * 1000),
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
    const args: Record<string, unknown> = { questionid: questionId };
    if (dto.name !== undefined) args.name = dto.name;
    if (dto.questionText !== undefined) args.questiontext = dto.questionText;
    if (dto.defaultMark !== undefined) args.defaultmark = dto.defaultMark;
    if (dto.options !== undefined)
      args.options_json = JSON.stringify(dto.options);

    const res = await client.call<MoodleUpdateQuestionResponse>(
      "local_examapi_update_question",
      args,
    );

    if (!res || (!res.id && !res.questionid && !res.success)) {
      throw new MoodleError("UPDATE_FAILED", "Failed to update question");
    }

    return new QuestionEntity(res.id ?? res.questionid ?? questionId, {
      categoryId: res.categoryid ?? res.category ?? 0,
      type: res.qtype ?? QuestionType.MULTICHOICE,
      name: res.name ?? dto.name ?? "",
      questionText: res.questiontext ?? dto.questionText ?? "",
      defaultMark: res.defaultmark ?? dto.defaultMark ?? 1,
      options: dto.options || [],
      createdAt: new Date((res.timecreated || Date.now() / 1000) * 1000),
      updatedAt: new Date((res.timemodified || Date.now() / 1000) * 1000),
    });
  }
}
