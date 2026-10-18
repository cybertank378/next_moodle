import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";
import type { CreateQuestionCategoryUseCase } from "@/modules/questions/application/usecases/CreateQuestionCategoryUseCase";
import type { CreateQuestionUseCase } from "@/modules/questions/application/usecases/CreateQuestionUseCase";
import type { GetQuestionCategoriesUseCase } from "@/modules/questions/application/usecases/GetQuestionCategoriesUseCase";
import type { GetQuestionsUseCase } from "@/modules/questions/application/usecases/GetQuestionsUseCase";
import type { UpdateQuestionUseCase } from "@/modules/questions/application/usecases/UpdateQuestionUseCase";

function actorToAuthorization(actor: CurrentActor): AuthorizationActor {
  return {
    id: actor.userId,
    role: actor.role as AppRole,
    tenantId: actor.tenantId || null,
    moodleUserId: actor.moodleUserId ?? undefined,
  };
}

export class QuestionController {
  constructor(
    private readonly createQuestionUseCase: CreateQuestionUseCase,
    private readonly updateQuestionUseCase: UpdateQuestionUseCase,
    private readonly clientFactory: MoodleClientFactory,
    private readonly getQuestionsUseCase?: GetQuestionsUseCase,
    private readonly getQuestionCategoriesUseCase?: GetQuestionCategoriesUseCase,
    private readonly createQuestionCategoryUseCase?: CreateQuestionCategoryUseCase,
  ) {}

  async getQuestions(req: Request) {
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

      const url = new URL(req.url);
      const categoryIdParam = url.searchParams.get("categoryId");
      const categoryId = categoryIdParam
        ? parseInt(categoryIdParam, 10)
        : undefined;
      const qtype = url.searchParams.get("qtype") || undefined;
      const search = url.searchParams.get("search") || undefined;
      const pageParam = url.searchParams.get("page");
      const page = pageParam ? parseInt(pageParam, 10) : undefined;
      const limitParam = url.searchParams.get("limit");
      const limit = limitParam ? parseInt(limitParam, 10) : undefined;

      if (!this.getQuestionsUseCase) {
        throw new Error("GetQuestionsUseCase not configured");
      }

      const result = await this.getQuestionsUseCase.execute({
        actor: actorToAuthorization(actor),
        categoryId,
        qtype,
        search,
        page,
        limit,
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

  async getCategories(req: Request) {
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

      const url = new URL(req.url);
      const contextIdParam = url.searchParams.get("contextId");
      const contextId = contextIdParam ? parseInt(contextIdParam, 10) : 1;

      if (!this.getQuestionCategoriesUseCase) {
        throw new Error("GetQuestionCategoriesUseCase not configured");
      }

      const result = await this.getQuestionCategoriesUseCase.execute({
        actor: actorToAuthorization(actor),
        contextId,
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

  async createCategory(req: Request) {
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
      if (!this.createQuestionCategoryUseCase) {
        throw new Error("CreateQuestionCategoryUseCase not configured");
      }

      const result = await this.createQuestionCategoryUseCase.execute({
        actor: actorToAuthorization(actor),
        name: body.name,
        contextId: body.contextId,
        parentId: body.parentId ?? body.parent,
        info: body.info,
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

  async createQuestion(req: Request) {
    try {
      const actor = await resolveCurrentActor(req);
      authorize(
        {
          role: actor.role as AppRole,
          id: actor.id ?? "anonymous",
          tenantId: actor.tenantId,
        },
        Permission.QUESTION_CREATE,
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
        Permission.QUESTION_UPDATE,
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
