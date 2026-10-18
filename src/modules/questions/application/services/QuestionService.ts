import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import {
  CreateQuestionCategoryUseCase,
  type CreateQuestionCategoryInput,
} from "@/modules/questions/application/usecases/CreateQuestionCategoryUseCase";
import {
  CreateQuestionUseCase,
  type CreateQuestionInput,
} from "@/modules/questions/application/usecases/CreateQuestionUseCase";
import {
  GetQuestionCategoriesUseCase,
  type GetQuestionCategoriesInput,
} from "@/modules/questions/application/usecases/GetQuestionCategoriesUseCase";
import {
  GetQuestionsUseCase,
  type GetQuestionsInput,
} from "@/modules/questions/application/usecases/GetQuestionsUseCase";
import {
  UpdateQuestionUseCase,
  type UpdateQuestionInput,
} from "@/modules/questions/application/usecases/UpdateQuestionUseCase";
import type { QuestionEntity } from "@/modules/questions/domain/entity/QuestionEntity";
import type { QuestionRepositoryInterface } from "@/modules/questions/domain/interfaces/QuestionRepositoryInterface";
import type {
  GetQuestionsResultDto,
  QuestionCategory,
} from "@/modules/questions/domain/types/QuestionTypes";

/* ============================================================
 * QUESTION SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Question Bank Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export class QuestionService extends BaseService {
  private readonly createQuestionCategoryUseCase: CreateQuestionCategoryUseCase;
  private readonly createQuestionUseCase: CreateQuestionUseCase;
  private readonly getQuestionCategoriesUseCase: GetQuestionCategoriesUseCase;
  private readonly getQuestionsUseCase: GetQuestionsUseCase;
  private readonly updateQuestionUseCase: UpdateQuestionUseCase;

  constructor(repo: QuestionRepositoryInterface) {
    super();

    this.createQuestionCategoryUseCase = new CreateQuestionCategoryUseCase(repo);
    this.createQuestionUseCase = new CreateQuestionUseCase(repo);
    this.getQuestionCategoriesUseCase = new GetQuestionCategoriesUseCase(repo);
    this.getQuestionsUseCase = new GetQuestionsUseCase(repo);
    this.updateQuestionUseCase = new UpdateQuestionUseCase(repo);
  }

  createQuestionCategory(
    input: CreateQuestionCategoryInput,
  ): Promise<Result<QuestionCategory, Error>> {
    return this.execute(() =>
      this.createQuestionCategoryUseCase.execute(input),
    );
  }

  createQuestion(input: CreateQuestionInput): Promise<Result<QuestionEntity, Error>> {
    return this.execute(() => this.createQuestionUseCase.execute(input));
  }

  getQuestionCategories(
    input: GetQuestionCategoriesInput,
  ): Promise<Result<QuestionCategory[], Error>> {
    return this.execute(() =>
      this.getQuestionCategoriesUseCase.execute(input),
    );
  }

  getQuestions(
    input: GetQuestionsInput,
  ): Promise<Result<GetQuestionsResultDto, Error>> {
    return this.execute(() => this.getQuestionsUseCase.execute(input));
  }

  updateQuestion(input: UpdateQuestionInput): Promise<Result<QuestionEntity, Error>> {
    return this.execute(() => this.updateQuestionUseCase.execute(input));
  }
}
