import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";
import type { AddQuestionToQuizUseCase } from "@/modules/exam/application/usecases/AddQuestionToQuizUseCase";
import type { AddRandomQuestionsToQuizUseCase } from "@/modules/exam/application/usecases/AddRandomQuestionsToQuizUseCase";
import type { GetQuizQuestionsUseCase } from "@/modules/exam/application/usecases/GetQuizQuestionsUseCase";
import type { ReorderQuizQuestionsUseCase } from "@/modules/exam/application/usecases/ReorderQuizQuestionsUseCase";

function actorToAuthorization(actor: CurrentActor): AuthorizationActor {
  return {
    id: actor.userId,
    role: actor.role as AppRole,
    tenantId: actor.tenantId || null,
    moodleUserId: actor.moodleUserId ?? undefined,
  };
}

export class ExamAdministrationController {
  constructor(
    private readonly reorderQuizQuestionsUseCase: ReorderQuizQuestionsUseCase,
    private readonly clientFactory: MoodleClientFactory,
    private readonly addQuestionToQuizUseCase?: AddQuestionToQuizUseCase,
    private readonly addRandomQuestionsToQuizUseCase?: AddRandomQuestionsToQuizUseCase,
    private readonly getQuizQuestionsUseCase?: GetQuizQuestionsUseCase,
  ) {}

  async reorderQuizQuestions(req: Request, quizId: number) {
    try {
      const actor = await resolveCurrentActor(req);
      authorize(
        {
          role: actor.role as AppRole,
          id: actor.id ?? "anonymous",
          tenantId: actor.tenantId,
        },
        Permission.EXAM_UPDATE,
      );

      const client = await this.clientFactory.createClientForTenant(
        {
          tenantId: actor.tenantId || "default",
          tenantSlug: actor.tenantId || "default",
          status: "ACTIVE",
        },
        "admin",
      );

      const body = await req.json();
      body.quizId = quizId;

      await this.reorderQuizQuestionsUseCase.execute(client, body);
      return NextResponse.json({
        success: true,
        data: { message: "Questions reordered successfully" },
      });
    } catch (error) {
      const res = mapErrorToHttpResponse(error);
      return NextResponse.json(res.body, { status: res.status });
    }
  }

  async addQuestionToQuiz(req: Request, quizId: number) {
    try {
      const actor = await resolveCurrentActor(req);
      const client = await this.clientFactory.createClientForTenant(
        {
          tenantId: actor.tenantId || "default",
          tenantSlug: actor.tenantId || "default",
          status: "ACTIVE",
        },
        "admin",
      );

      const body = await req.json();
      if (!this.addQuestionToQuizUseCase) {
        throw new Error("AddQuestionToQuizUseCase not configured");
      }

      const result = await this.addQuestionToQuizUseCase.execute({
        actor: actorToAuthorization(actor),
        quizId,
        questionId: body.questionId,
        maxMark: body.maxMark,
        page: body.page,
        tenantId: actor.tenantId || undefined,
        client,
      });

      if (result.isFailure) {
        const res = mapErrorToHttpResponse(result.getError());
        return NextResponse.json(res.body, { status: res.status });
      }

      return NextResponse.json({
        success: true,
        data: result.getValue(),
      });
    } catch (error) {
      const res = mapErrorToHttpResponse(error);
      return NextResponse.json(res.body, { status: res.status });
    }
  }

  async addRandomQuestions(req: Request, quizId: number) {
    try {
      const actor = await resolveCurrentActor(req);
      const client = await this.clientFactory.createClientForTenant(
        {
          tenantId: actor.tenantId || "default",
          tenantSlug: actor.tenantId || "default",
          status: "ACTIVE",
        },
        "admin",
      );

      const body = await req.json();
      if (!this.addRandomQuestionsToQuizUseCase) {
        throw new Error("AddRandomQuestionsToQuizUseCase not configured");
      }

      const result = await this.addRandomQuestionsToQuizUseCase.execute({
        actor: actorToAuthorization(actor),
        quizId,
        categoryId: body.categoryId,
        randomCount: body.randomCount,
        includeSubcategories: body.includeSubcategories,
        tenantId: actor.tenantId || undefined,
        client,
      });

      if (result.isFailure) {
        const res = mapErrorToHttpResponse(result.getError());
        return NextResponse.json(res.body, { status: res.status });
      }

      return NextResponse.json({
        success: true,
        data: result.getValue(),
      });
    } catch (error) {
      const res = mapErrorToHttpResponse(error);
      return NextResponse.json(res.body, { status: res.status });
    }
  }

  async getQuizQuestions(req: Request, quizId: number) {
    try {
      const actor = await resolveCurrentActor(req);
      const client = await this.clientFactory.createClientForTenant(
        {
          tenantId: actor.tenantId || "default",
          tenantSlug: actor.tenantId || "default",
          status: "ACTIVE",
        },
        "admin",
      );

      if (!this.getQuizQuestionsUseCase) {
        throw new Error("GetQuizQuestionsUseCase not configured");
      }

      const result = await this.getQuizQuestionsUseCase.execute({
        actor: actorToAuthorization(actor),
        quizId,
        tenantId: actor.tenantId || undefined,
        client,
      });

      if (result.isFailure) {
        const res = mapErrorToHttpResponse(result.getError());
        return NextResponse.json(res.body, { status: res.status });
      }

      return NextResponse.json({
        success: true,
        data: result.getValue(),
      });
    } catch (error) {
      const res = mapErrorToHttpResponse(error);
      return NextResponse.json(res.body, { status: res.status });
    }
  }
}
