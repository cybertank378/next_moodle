import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import {
  AddQuestionToQuizUseCase,
  type AddQuestionToQuizInput,
  type AddQuestionToQuizResult,
} from "@/modules/exam/application/usecases/AddQuestionToQuizUseCase";
import {
  AddRandomQuestionsToQuizUseCase,
  type AddRandomQuestionsToQuizInput,
} from "@/modules/exam/application/usecases/AddRandomQuestionsToQuizUseCase";
import {
  GetQuizQuestionsUseCase,
  type GetQuizQuestionsInput,
} from "@/modules/exam/application/usecases/GetQuizQuestionsUseCase";
import {
  ReorderQuizQuestionsUseCase,
  type ReorderQuizQuestionsInput,
} from "@/modules/exam/application/usecases/ReorderQuizQuestionsUseCase";
import type {
  ExamAdministrationRepositoryInterface,
  QuizQuestionSlot,
} from "@/modules/exam/domain/interfaces/ExamAdministrationRepositoryInterface";

/* ============================================================
 * EXAM SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Exam Administration Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export class ExamService extends BaseService {
  private readonly addQuestionToQuizUseCase: AddQuestionToQuizUseCase;
  private readonly addRandomQuestionsToQuizUseCase: AddRandomQuestionsToQuizUseCase;
  private readonly getQuizQuestionsUseCase: GetQuizQuestionsUseCase;
  private readonly reorderQuizQuestionsUseCase: ReorderQuizQuestionsUseCase;

  constructor(repo: ExamAdministrationRepositoryInterface) {
    super();

    this.addQuestionToQuizUseCase = new AddQuestionToQuizUseCase(repo);
    this.addRandomQuestionsToQuizUseCase = new AddRandomQuestionsToQuizUseCase(repo);
    this.getQuizQuestionsUseCase = new GetQuizQuestionsUseCase(repo);
    this.reorderQuizQuestionsUseCase = new ReorderQuizQuestionsUseCase(repo);
  }

  addQuestionToQuiz(
    input: AddQuestionToQuizInput,
  ): Promise<Result<AddQuestionToQuizResult, Error>> {
    return this.execute(() => this.addQuestionToQuizUseCase.execute(input));
  }

  addRandomQuestionsToQuiz(
    input: AddRandomQuestionsToQuizInput,
  ): Promise<Result<{ message: string }, Error>> {
    return this.execute(() =>
      this.addRandomQuestionsToQuizUseCase.execute(input),
    );
  }

  getQuizQuestions(
    input: GetQuizQuestionsInput,
  ): Promise<Result<QuizQuestionSlot[], Error>> {
    return this.execute(() => this.getQuizQuestionsUseCase.execute(input));
  }

  reorderQuizQuestions(
    input: ReorderQuizQuestionsInput,
  ): Promise<Result<void, Error>> {
    return this.execute(() => this.reorderQuizQuestionsUseCase.execute(input));
  }
}
