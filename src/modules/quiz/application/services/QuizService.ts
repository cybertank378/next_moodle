import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import {
  CheckQuizAccessUseCase,
  type CheckQuizAccessInput,
} from "@/modules/quiz/application/usecases/CheckQuizAccessUseCase";
import {
  GetAttemptDataUseCase,
  type GetAttemptDataInput,
} from "@/modules/quiz/application/usecases/GetAttemptDataUseCase";
import {
  GetAttemptSummaryUseCase,
  type GetAttemptSummaryInput,
} from "@/modules/quiz/application/usecases/GetAttemptSummaryUseCase";
import {
  GetQuizDetailUseCase,
  type GetQuizDetailInput,
} from "@/modules/quiz/application/usecases/GetQuizDetailUseCase";
import {
  GetQuizzesByCourseUseCase,
  type GetQuizzesByCourseInput,
} from "@/modules/quiz/application/usecases/GetQuizzesByCourseUseCase";
import {
  GetUserAttemptsUseCase,
  type GetUserAttemptsInput,
} from "@/modules/quiz/application/usecases/GetUserAttemptsUseCase";
import {
  SaveQuizAnswerUseCase,
  type SaveQuizAnswerInput,
} from "@/modules/quiz/application/usecases/SaveQuizAnswerUseCase";
import {
  StartQuizAttemptUseCase,
  type StartQuizAttemptInput,
} from "@/modules/quiz/application/usecases/StartQuizAttemptUseCase";
import {
  SubmitQuizAttemptUseCase,
  type SubmitQuizAttemptInput,
} from "@/modules/quiz/application/usecases/SubmitQuizAttemptUseCase";
import type {
  QuizAttemptDataResponseDto,
  QuizAttemptResponseDto,
  QuizAttemptSummaryResponseDto,
  SaveQuizAnswerResponseDto,
  SubmitQuizAttemptResponseDto,
} from "@/modules/quiz/domain/dto/QuizAttemptResponseDto";
import type {
  QuizAccessResponseDTO,
  QuizListResponseDTO,
  QuizSummaryResponseDTO,
} from "@/modules/quiz/domain/dto/QuizResponseDto";
import type { QuizAttemptRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizAttemptRepositoryInterface";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";

/* ============================================================
 * QUIZ SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Quiz & Attempt Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export class QuizService extends BaseService {
  private readonly checkQuizAccessUseCase: CheckQuizAccessUseCase;
  private readonly getAttemptDataUseCase: GetAttemptDataUseCase;
  private readonly getAttemptSummaryUseCase: GetAttemptSummaryUseCase;
  private readonly getQuizDetailUseCase: GetQuizDetailUseCase;
  private readonly getQuizzesByCourseUseCase: GetQuizzesByCourseUseCase;
  private readonly getUserAttemptsUseCase: GetUserAttemptsUseCase;
  private readonly saveQuizAnswerUseCase: SaveQuizAnswerUseCase;
  private readonly startQuizAttemptUseCase: StartQuizAttemptUseCase;
  private readonly submitQuizAttemptUseCase: SubmitQuizAttemptUseCase;

  constructor(
    quizRepo: QuizRepositoryInterface,
    attemptRepo: QuizAttemptRepositoryInterface,
  ) {
    super();

    this.checkQuizAccessUseCase = new CheckQuizAccessUseCase(quizRepo);
    this.getAttemptDataUseCase = new GetAttemptDataUseCase(attemptRepo);
    this.getAttemptSummaryUseCase = new GetAttemptSummaryUseCase(attemptRepo);
    this.getQuizDetailUseCase = new GetQuizDetailUseCase(quizRepo);
    this.getQuizzesByCourseUseCase = new GetQuizzesByCourseUseCase(quizRepo);
    this.getUserAttemptsUseCase = new GetUserAttemptsUseCase(attemptRepo);
    this.saveQuizAnswerUseCase = new SaveQuizAnswerUseCase(attemptRepo);
    this.startQuizAttemptUseCase = new StartQuizAttemptUseCase(attemptRepo);
    this.submitQuizAttemptUseCase = new SubmitQuizAttemptUseCase(attemptRepo);
  }

  checkQuizAccess(
    input: CheckQuizAccessInput,
  ): Promise<Result<QuizAccessResponseDTO, Error>> {
    return this.execute(() => this.checkQuizAccessUseCase.execute(input));
  }

  getAttemptData(
    input: GetAttemptDataInput,
  ): Promise<Result<QuizAttemptDataResponseDto, Error>> {
    return this.execute(() => this.getAttemptDataUseCase.execute(input));
  }

  getAttemptSummary(
    input: GetAttemptSummaryInput,
  ): Promise<Result<QuizAttemptSummaryResponseDto, Error>> {
    return this.execute(() => this.getAttemptSummaryUseCase.execute(input));
  }

  getQuizDetail(
    input: GetQuizDetailInput,
  ): Promise<Result<QuizSummaryResponseDTO, Error>> {
    return this.execute(() => this.getQuizDetailUseCase.execute(input));
  }

  getQuizzesByCourse(
    input: GetQuizzesByCourseInput,
  ): Promise<Result<QuizListResponseDTO, Error>> {
    return this.execute(() => this.getQuizzesByCourseUseCase.execute(input));
  }

  getUserAttempts(
    input: GetUserAttemptsInput,
  ): Promise<Result<QuizAttemptResponseDto[], Error>> {
    return this.execute(() => this.getUserAttemptsUseCase.execute(input));
  }

  saveQuizAnswer(
    input: SaveQuizAnswerInput,
  ): Promise<Result<SaveQuizAnswerResponseDto, Error>> {
    return this.execute(() => this.saveQuizAnswerUseCase.execute(input));
  }

  startQuizAttempt(
    input: StartQuizAttemptInput,
  ): Promise<Result<QuizAttemptResponseDto, Error>> {
    return this.execute(() => this.startQuizAttemptUseCase.execute(input));
  }

  submitQuizAttempt(
    input: SubmitQuizAttemptInput,
  ): Promise<Result<SubmitQuizAttemptResponseDto, Error>> {
    return this.execute(() => this.submitQuizAttemptUseCase.execute(input));
  }
}
