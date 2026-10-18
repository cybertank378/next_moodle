// Files: src/modules/questions/infrastructure/repo/MoodleQuestionRepository.ts

import { MoodleError } from "@/core/errors/MoodleError";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import { QuestionEntity } from "@/modules/questions/domain/entity/QuestionEntity";
import type {
  CreateQuestionCategoryRepoInput,
  GetQuestionCategoriesRepoInput,
  GetQuestionsRepoInput,
  QuestionRepositoryInterface,
} from "@/modules/questions/domain/interfaces/QuestionRepositoryInterface";
import {
  type CreateQuestionCategoryRequestDto,
  type CreateQuestionRequestDto,
  type GetQuestionsQueryDto,
  type GetQuestionsResultDto,
  type QuestionCategory,
  QuestionType,
  type UpdateQuestionRequestDto,
} from "@/modules/questions/domain/types/QuestionTypes";

interface MoodleQuestionItem {
  id: number;
  categoryid?: number;
  category?: number;
  qtype: QuestionType | string;
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

interface MoodleCategoryItem {
  id: number;
  name: string;
  contextid: number;
  parent: number;
  info?: string;
  questioncount?: number;
}

interface MoodleGetCategoriesResponse {
  contextid?: number;
  total?: number;
  categories?: MoodleCategoryItem[];
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
  constructor(private readonly clientFactory?: MoodleClientFactory) {}

  private async resolveClient(
    tenantId: string,
    clientOverride?: MoodleClient,
  ): Promise<MoodleClient> {
    if (clientOverride) return clientOverride;
    if (!this.clientFactory) {
      throw new Error(
        "Moodle client or clientFactory is required to execute question operations.",
      );
    }
    return this.clientFactory.createClientForTenant(
      { tenantId, tenantSlug: tenantId, status: "ACTIVE" },
      "admin",
    );
  }

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
          type: q.qtype as QuestionType,
          name: q.name,
          questionText: q.questiontext ?? "",
          defaultMark: q.defaultmark ?? 1,
          options: [],
          createdAt: new Date((q.timecreated || 0) * 1000),
          updatedAt: new Date((q.timemodified || 0) * 1000),
        }),
    );
  }

  async getQuestions(
    clientOrInput: MoodleClient | GetQuestionsRepoInput,
    params?: GetQuestionsQueryDto,
  ): Promise<GetQuestionsResultDto> {
    let client: MoodleClient;
    let queryParams: GetQuestionsQueryDto;

    if ("tenantId" in clientOrInput) {
      client = await this.resolveClient(
        clientOrInput.tenantId,
        clientOrInput.client,
      );
      queryParams = clientOrInput.params;
    } else {
      client = clientOrInput;
      queryParams = params || {};
    }

    const args: Record<string, unknown> = {};
    if (queryParams.categoryId !== undefined)
      args.categoryid = queryParams.categoryId;
    if (queryParams.qtype) args.qtype = queryParams.qtype;
    if (queryParams.status) args.status = queryParams.status;
    if (queryParams.search) args.search = queryParams.search;
    if (queryParams.page !== undefined) args.page = queryParams.page;
    if (queryParams.limit !== undefined) args.limit = queryParams.limit;

    const res = await client.call<
      MoodleGetQuestionsResponse | MoodleQuestionItem[]
    >("local_examapi_get_questions", args);

    if (Array.isArray(res)) {
      return {
        total: res.length,
        page: queryParams.page ?? 1,
        limit: queryParams.limit ?? res.length,
        questions: res.map((q) => ({
          id: q.id,
          categoryId:
            q.categoryid ?? q.category ?? (queryParams.categoryId ?? 0),
          type: q.qtype,
          name: q.name,
          questionText: q.questiontext ?? "",
          defaultMark: q.defaultmark ?? 1,
          createdAt: q.timecreated ? new Date(q.timecreated * 1000) : undefined,
          updatedAt: q.timemodified
            ? new Date(q.timemodified * 1000)
            : undefined,
        })),
      };
    }

    const items = res?.questions ?? [];
    return {
      total: res?.total ?? items.length,
      page: res?.page ?? (queryParams.page ?? 1),
      limit: res?.limit ?? (queryParams.limit ?? 20),
      questions: items.map((q) => ({
        id: q.id,
        categoryId: q.categoryid ?? q.category ?? (queryParams.categoryId ?? 0),
        type: q.qtype,
        name: q.name,
        questionText: q.questiontext ?? "",
        defaultMark: q.defaultmark ?? 1,
        createdAt: q.timecreated ? new Date(q.timecreated * 1000) : undefined,
        updatedAt: q.timemodified ? new Date(q.timemodified * 1000) : undefined,
      })),
    };
  }

  async getQuestionCategories(
    clientOrInput: MoodleClient | GetQuestionCategoriesRepoInput,
    contextId?: number,
  ): Promise<QuestionCategory[]> {
    let client: MoodleClient;
    let targetContextId: number;

    if ("tenantId" in clientOrInput) {
      client = await this.resolveClient(
        clientOrInput.tenantId,
        clientOrInput.client,
      );
      targetContextId = clientOrInput.contextId;
    } else {
      client = clientOrInput;
      targetContextId = contextId ?? 1;
    }

    const res = await client.call<
      MoodleGetCategoriesResponse | MoodleCategoryItem[]
    >("local_examapi_get_question_categories", {
      contextid: targetContextId,
    });

    const categories = Array.isArray(res) ? res : (res?.categories ?? []);

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      contextId: cat.contextid ?? targetContextId,
      parent: cat.parent ?? 0,
      info: cat.info,
      questionCount: cat.questioncount ?? 0,
    }));
  }

  async createQuestionCategory(
    clientOrInput: MoodleClient | CreateQuestionCategoryRepoInput,
    dto?: CreateQuestionCategoryRequestDto,
  ): Promise<QuestionCategory> {
    let client: MoodleClient;
    let targetDto: CreateQuestionCategoryRequestDto;

    if ("tenantId" in clientOrInput) {
      client = await this.resolveClient(
        clientOrInput.tenantId,
        clientOrInput.client,
      );
      targetDto = clientOrInput.dto;
    } else {
      client = clientOrInput;
      targetDto = dto!;
    }

    const res = await client.call<MoodleCategoryItem>(
      "local_examapi_create_question_category",
      {
        name: targetDto.name,
        contextid: targetDto.contextId,
        parent: targetDto.parent ?? 0,
        info: targetDto.info ?? "",
      },
    );

    if (!res?.id) {
      throw new MoodleError(
        "CREATE_FAILED",
        "Failed to create question category",
      );
    }

    return {
      id: res.id,
      name: res.name,
      contextId: res.contextid ?? targetDto.contextId,
      parent: res.parent ?? (targetDto.parent ?? 0),
      info: res.info ?? targetDto.info,
      questionCount: res.questioncount ?? 0,
    };
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
      type: (res.qtype as QuestionType) ?? dto.type,
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
