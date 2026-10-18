import { MoodleError } from "@/core/errors/MoodleError";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import type {
  AddQuestionToQuizRepoInput,
  AddRandomQuestionsRepoInput,
  ExamAdministrationRepositoryInterface,
  GetQuizQuestionsRepoInput,
  QuizQuestionSlot,
  ReorderQuizQuestionsInput,
} from "@/modules/exam/domain/interfaces/ExamAdministrationRepositoryInterface";

export class MoodleExamAdministrationRepository
  implements ExamAdministrationRepositoryInterface
{
  constructor(private readonly clientFactory?: MoodleClientFactory) {}

  private async resolveClient(
    tenantId: string,
    clientOverride?: MoodleClient,
  ): Promise<MoodleClient> {
    if (clientOverride) return clientOverride;
    if (!this.clientFactory) {
      throw new Error(
        "Moodle client or clientFactory is required to execute exam administration operations.",
      );
    }
    return this.clientFactory.createClientForTenant(
      { tenantId, tenantSlug: tenantId, status: "ACTIVE" },
      "admin",
    );
  }

  async reorderQuizQuestions(
    inputOrClient: ReorderQuizQuestionsInput | MoodleClient,
    quizId?: number,
    questions?: Array<{ questionId: number; slot: number }>,
  ): Promise<void> {
    let client: MoodleClient;
    let targetQuizId: number;
    let targetQuestions: Array<{ questionId: number; slot: number }>;

    if ("tenantId" in inputOrClient) {
      client = await this.resolveClient(
        inputOrClient.tenantId,
        inputOrClient.client,
      );
      targetQuizId = inputOrClient.quizId;
      targetQuestions = inputOrClient.questions;
    } else {
      client = inputOrClient;
      targetQuizId = quizId!;
      targetQuestions = questions!;
    }

    const sortedSlotIds = targetQuestions
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map((q) => q.slot);

    const res = await client.call<{
      success?: boolean;
      quizid?: number;
      error?: string;
    }>("local_examapi_reorder_quiz_questions", {
      quizid: targetQuizId,
      slotids_json: JSON.stringify(sortedSlotIds),
    });

    if (res?.error) {
      throw new MoodleError(
        "REORDER_FAILED",
        `Failed to reorder quiz questions: ${res.error}`,
      );
    }
  }

  async addQuestionToQuiz(
    input: AddQuestionToQuizRepoInput,
  ): Promise<{ id: number; slot: number; page: number }> {
    const client = await this.resolveClient(input.tenantId, input.client);

    const res = await client.call<{
      id: number;
      quizid: number;
      slot: number;
      page: number;
      questionid: number;
      maxmark: number;
      is_random: boolean;
      error?: string;
    }>("local_examapi_add_question_to_quiz", {
      quizid: input.quizId,
      questionid: input.questionId,
      maxmark: input.maxMark ?? 1.0,
      page: input.page ?? 1,
    });

    if (!res?.id) {
      throw new MoodleError(
        "ADD_QUESTION_FAILED",
        res?.error || "Failed to add question to quiz",
      );
    }

    return {
      id: res.id,
      slot: res.slot,
      page: res.page,
    };
  }

  async addRandomQuestions(input: AddRandomQuestionsRepoInput): Promise<void> {
    const client = await this.resolveClient(input.tenantId, input.client);

    const res = await client.call<{
      id: number;
      quizid: number;
      error?: string;
    }>("local_examapi_add_random_questions", {
      quizid: input.quizId,
      categoryid: input.categoryId,
      randomcount: input.randomCount ?? 1,
      includesubcategories: input.includeSubcategories ?? false,
    });

    if (!res?.id) {
      throw new MoodleError(
        "ADD_RANDOM_QUESTIONS_FAILED",
        res?.error || "Failed to add random questions to quiz",
      );
    }
  }

  async getQuizQuestions(
    input: GetQuizQuestionsRepoInput,
  ): Promise<QuizQuestionSlot[]> {
    const client = await this.resolveClient(input.tenantId, input.client);

    const res = await client.call<{
      quizid: number;
      total_slots: number;
      slots: Array<{
        id: number;
        quizid: number;
        slot: number;
        page: number;
        questionid: number;
        questionname: string;
        qtype: string;
        maxmark: number;
        is_random: boolean;
      }>;
    }>("local_examapi_get_quiz_questions", {
      quizid: input.quizId,
    });

    const slots = res?.slots ?? [];
    return slots.map((s) => ({
      id: s.id,
      quizId: s.quizid,
      slot: s.slot,
      page: s.page,
      questionId: s.questionid,
      questionName: s.questionname,
      qtype: s.qtype,
      maxMark: s.maxmark,
      isRandom: s.is_random,
    }));
  }
}
