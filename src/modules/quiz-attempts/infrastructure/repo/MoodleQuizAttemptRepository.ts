import "server-only";

import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import type {
  QuizAttemptDataResponseDto,
  QuizAttemptSummaryResponseDto,
} from "../../domain/dto/QuizAttemptResponseDto";
import type { QuizAttemptEntity } from "../../domain/entity/QuizAttemptEntity";
import type { QuizAttemptRepositoryInterface } from "../../domain/interfaces/QuizAttemptRepositoryInterface";
import { QuizAttemptMapper } from "../../domain/mapper/QuizAttemptMapper";
import type {
  MoodleAnswerPayloadItem,
  QuizAttemptStatus,
  RawMoodleAttempt,
  RawMoodleAttemptData,
  RawMoodleAttemptSummary,
} from "../../domain/types/QuizAttemptTypes";

interface MoodleStartAttemptResponse {
  attempt: RawMoodleAttempt;
  warnings?: unknown[];
}

interface MoodleUserAttemptsResponse {
  attempts?: RawMoodleAttempt[];
  warnings?: unknown[];
}

interface MoodleSaveAttemptResponse {
  status?: boolean | number;
  warnings?: unknown[];
}

interface MoodleProcessAttemptResponse {
  state: string;
  warnings?: unknown[];
}

export class MoodleQuizAttemptRepository
  implements QuizAttemptRepositoryInterface
{
  constructor(
    private readonly clientFactory: MoodleClientFactory,
    private readonly clientOverride?: MoodleClient,
  ) {}

  private async resolveClient(
    tenantId: string,
    studentMoodleToken?: string,
  ): Promise<MoodleClient> {
    if (this.clientOverride) return this.clientOverride;

    if (studentMoodleToken) {
      try {
        const tenantClient = await this.clientFactory.createClientForTenant(
          { tenantId, tenantSlug: tenantId, status: "ACTIVE" },
          "admin",
        );
        if (typeof this.clientFactory.createClient === "function") {
          return this.clientFactory.createClient({
            baseUrl:
              (
                tenantClient as unknown as { endpoint?: string }
              ).endpoint?.replace(/\/webservice\/rest\/server\.php.*$/, "") ||
              "http://localhost:8080",
            token: studentMoodleToken,
          });
        }
        return tenantClient;
      } catch {
        if (typeof this.clientFactory.createClient === "function") {
          return this.clientFactory.createClient({
            baseUrl: "http://localhost:8080",
            token: studentMoodleToken,
          });
        }
      }
    }

    return this.clientFactory.createClientForTenant(
      { tenantId, tenantSlug: tenantId, status: "ACTIVE" },
      "admin",
    );
  }

  async startAttempt(
    tenantId: string,
    studentMoodleToken: string,
    quizId: number,
    forceNew = false,
    userId?: string,
  ): Promise<QuizAttemptEntity> {
    const client = await this.resolveClient(tenantId, studentMoodleToken);

    const response = await client.call<MoodleStartAttemptResponse>(
      "mod_quiz_start_attempt",
      {
        quizid: quizId,
        forcenew: forceNew ? 1 : 0,
      },
    );

    return QuizAttemptMapper.toEntity(response.attempt, tenantId, userId);
  }

  async getAttemptById(
    tenantId: string,
    studentMoodleToken: string,
    attemptId: number,
    quizId?: number,
    userId?: string,
  ): Promise<QuizAttemptEntity | null> {
    const client = await this.resolveClient(tenantId, studentMoodleToken);

    try {
      const response = await client.call<RawMoodleAttemptData>(
        "mod_quiz_get_attempt_data",
        {
          attemptid: attemptId,
          page: 0,
        },
      );

      if (response?.attempt) {
        return QuizAttemptMapper.toEntity(response.attempt, tenantId, userId);
      }
    } catch {
      // Fallback: if quizId is provided, query user attempts
      if (quizId) {
        const userAttempts = await this.getUserAttempts(
          tenantId,
          studentMoodleToken,
          quizId,
          undefined,
          "all",
          userId,
        );
        return userAttempts.find((a) => a.id === attemptId) ?? null;
      }
    }

    return null;
  }

  async getUserAttempts(
    tenantId: string,
    studentMoodleToken: string,
    quizId: number,
    moodleUserId?: number,
    status: "all" | "finished" | "unfinished" = "all",
    userId?: string,
  ): Promise<QuizAttemptEntity[]> {
    const client = await this.resolveClient(tenantId, studentMoodleToken);

    try {
      const params: Record<string, unknown> = {
        quizid: quizId,
        status,
        includepreviews: 0,
      };
      if (moodleUserId !== undefined) {
        params.userid = moodleUserId;
      }

      const response = await client.call<
        MoodleUserAttemptsResponse | RawMoodleAttempt[]
      >("mod_quiz_get_user_attempts", params);

      const attemptsList: RawMoodleAttempt[] = Array.isArray(response)
        ? response
        : (response?.attempts ?? []);

      return attemptsList.map((raw) =>
        QuizAttemptMapper.toEntity(raw, tenantId, userId),
      );
    } catch {
      return [];
    }
  }

  async getAttemptData(
    tenantId: string,
    studentMoodleToken: string,
    attemptId: number,
    page: number,
    userId?: string,
  ): Promise<QuizAttemptDataResponseDto> {
    const client = await this.resolveClient(tenantId, studentMoodleToken);

    const response = await client.call<RawMoodleAttemptData>(
      "mod_quiz_get_attempt_data",
      {
        attemptid: attemptId,
        page,
      },
    );

    return {
      attempt: QuizAttemptMapper.toDto(
        QuizAttemptMapper.toEntity(response.attempt, tenantId, userId),
      ),
      questions: (response.questions ?? []).map((q) =>
        QuizAttemptMapper.toQuestionDto(q),
      ),
      nextPage: response.nextpage ?? -1,
    };
  }

  async getAttemptSummary(
    tenantId: string,
    studentMoodleToken: string,
    attemptId: number,
  ): Promise<QuizAttemptSummaryResponseDto> {
    const client = await this.resolveClient(tenantId, studentMoodleToken);

    const response = await client.call<RawMoodleAttemptSummary>(
      "mod_quiz_get_attempt_summary",
      {
        attemptid: attemptId,
      },
    );

    return {
      questions: (response.questions ?? []).map((q) =>
        QuizAttemptMapper.toQuestionDto(q),
      ),
    };
  }

  async saveAttempt(
    tenantId: string,
    studentMoodleToken: string,
    attemptId: number,
    data: MoodleAnswerPayloadItem[],
  ): Promise<boolean> {
    const client = await this.resolveClient(tenantId, studentMoodleToken);

    const response = await client.call<MoodleSaveAttemptResponse>(
      "mod_quiz_save_attempt",
      {
        attemptid: attemptId,
        data,
      },
    );

    return response.status === true || response.status === 1;
  }

  async processAttempt(
    tenantId: string,
    studentMoodleToken: string,
    attemptId: number,
    data: MoodleAnswerPayloadItem[],
    finishAttempt = true,
    timeUp = false,
  ): Promise<{ state: QuizAttemptStatus }> {
    const client = await this.resolveClient(tenantId, studentMoodleToken);

    const response = await client.call<MoodleProcessAttemptResponse>(
      "mod_quiz_process_attempt",
      {
        attemptid: attemptId,
        data,
        finishattempt: finishAttempt ? 1 : 0,
        timeup: timeUp ? 1 : 0,
      },
    );

    return {
      state: QuizAttemptMapper.mapMoodleState(response.state),
    };
  }
}
