import "server-only";

import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import type { QuizEntity } from "../../domain/entity/QuizEntity";
import type { QuizRepositoryInterface } from "../../domain/interfaces/QuizRepositoryInterface";
import { QuizMapper } from "../../domain/mapper/QuizMapper";
import type {
  RawMoodleQuiz,
  RawMoodleQuizAccessInfo,
} from "../../domain/types/QuizTypes";

interface MoodleQuizzesResponse {
  quizzes?: RawMoodleQuiz[];
  warnings?: unknown[];
}

export class MoodleQuizRepository implements QuizRepositoryInterface {
  constructor(private readonly clientFactory: MoodleClientFactory) {}

  private async resolveClient(
    tenantId: string,
    clientOverride?: MoodleClient,
  ): Promise<MoodleClient> {
    if (clientOverride) return clientOverride;
    return this.clientFactory.createClientForTenant(
      { tenantId, tenantSlug: tenantId, status: "ACTIVE" },
      "admin",
    );
  }

  async getQuizzesByCourses(input: {
    tenantId: string;
    courseIds: number[];
    client?: MoodleClient;
  }): Promise<QuizEntity[]> {
    const client = await this.resolveClient(input.tenantId, input.client);

    try {
      const response = await client.call<
        MoodleQuizzesResponse | RawMoodleQuiz[]
      >("mod_quiz_get_quizzes_by_courses", {
        courseids: input.courseIds,
      });

      const rawList: RawMoodleQuiz[] = Array.isArray(response)
        ? response
        : (response?.quizzes ?? []);

      return rawList.map((raw) => QuizMapper.toEntity(raw, input.tenantId));
    } catch {
      return [];
    }
  }

  async getQuizById(input: {
    tenantId: string;
    quizId: number;
    courseId?: number;
    client?: MoodleClient;
  }): Promise<QuizEntity | null> {
    const courseIds = input.courseId ? [input.courseId] : [];
    const quizzes = await this.getQuizzesByCourses({
      tenantId: input.tenantId,
      courseIds,
      client: input.client,
    });

    return quizzes.find((q) => q.id === input.quizId) ?? null;
  }

  async getQuizAccessInfo(input: {
    tenantId: string;
    quizId: number;
    client?: MoodleClient;
  }): Promise<RawMoodleQuizAccessInfo | null> {
    const client = await this.resolveClient(input.tenantId, input.client);

    try {
      const info = await client.call<RawMoodleQuizAccessInfo>(
        "mod_quiz_get_quiz_access_information",
        {
          quizid: input.quizId,
        },
      );
      return info ?? null;
    } catch {
      // If function is not registered or fails, gracefully return null
      // so domain rules can authoritatively evaluate access
      return null;
    }
  }
}
