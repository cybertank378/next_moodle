import { NextResponse } from "next/server";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { AppRole } from "@/core/rbac/AppRole";
import { authorize } from "@/core/rbac/authorize";
import type { CreateQuestionUseCase } from "../../application/usecases/CreateQuestionUseCase";
import type { UpdateQuestionUseCase } from "../../application/usecases/UpdateQuestionUseCase";

export class QuestionController {
  constructor(
    private readonly createQuestionUseCase: CreateQuestionUseCase,
    private readonly updateQuestionUseCase: UpdateQuestionUseCase,
    private readonly clientFactory: MoodleClientFactory,
  ) {}

  async createQuestion(req: Request) {
    try {
      const actor = await resolveCurrentActor(req);
      authorize(
        {
          role: actor.role as AppRole,
          id: actor.id ?? "anonymous",
          tenantId: actor.tenantId,
        },
        "question.create",
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
      const question = await this.createQuestionUseCase.execute(client, body);

      return NextResponse.json({
        success: true,
        data: {
          id: question.id,
          categoryId: question.categoryId,
          type: question.type,
          name: question.name,
          questionText: question.questionText,
          defaultMark: question.defaultMark,
          options: question.options,
          createdAt: question.createdAt.toISOString(),
          updatedAt: question.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      const res = mapErrorToHttpResponse(error);
      return NextResponse.json(res.body, { status: res.status });
    }
  }

  async updateQuestion(req: Request, questionId: string) {
    try {
      const actor = await resolveCurrentActor(req);
      authorize(
        {
          role: actor.role as AppRole,
          id: actor.id ?? "anonymous",
          tenantId: actor.tenantId,
        },
        "question.create", // using question.create as proxy for question management
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
      const id = parseInt(questionId, 10);
      if (isNaN(id)) {
        return NextResponse.json(
          { success: false, error: { message: "Invalid question ID" } },
          { status: 400 },
        );
      }

      const question = await this.updateQuestionUseCase.execute(
        client,
        id,
        body,
      );

      return NextResponse.json({
        success: true,
        data: {
          id: question.id,
          categoryId: question.categoryId,
          type: question.type,
          name: question.name,
          questionText: question.questionText,
          defaultMark: question.defaultMark,
          options: question.options,
          createdAt: question.createdAt.toISOString(),
          updatedAt: question.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      const res = mapErrorToHttpResponse(error);
      return NextResponse.json(res.body, { status: res.status });
    }
  }
}
