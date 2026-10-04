import { NextResponse } from "next/server";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { AppRole } from "@/core/rbac/AppRole";
import { authorize } from "@/core/rbac/authorize";
import type { ReorderQuizQuestionsUseCase } from "../../application/usecases/ReorderQuizQuestionsUseCase";

export class ExamAdministrationController {
  constructor(
    private readonly reorderQuizQuestionsUseCase: ReorderQuizQuestionsUseCase,
    private readonly clientFactory: MoodleClientFactory,
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
        "exam.update",
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
      return mapErrorToHttpResponse(error);
    }
  }
}
