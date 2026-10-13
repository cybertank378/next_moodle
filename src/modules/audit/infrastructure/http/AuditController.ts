import "server-only";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { ValidationError } from "@/core/errors/ValidationError";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { GetAuditDetailUseCase } from "@/modules/audit/application/usecases/GetAuditDetailUseCase";
import type { GetAuditListUseCase } from "@/modules/audit/application/usecases/GetAuditListUseCase";
import { parseAuditQuery } from "@/modules/audit/domain/builder/AuditQueryBuilder";

const HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie, Authorization",
};
const reply = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: HEADERS });
const failed = (e: unknown) => {
  const r = mapErrorToHttpResponse(e);
  return reply(r.body, r.status);
};
export class AuditController {
  constructor(
    private readonly listUC: GetAuditListUseCase,
    private readonly detailUC: GetAuditDetailUseCase,
  ) {}
  async list(request: Request): Promise<Response> {
    try {
      const actor = await resolveCurrentActor(request);
      const q = parseAuditQuery(new URL(request.url).searchParams);
      return reply(
        ApiResponse.success(await this.listUC.execute(actor, q)).body,
      );
    } catch (e) {
      return failed(e);
    }
  }
  async detail(request: Request, id: string): Promise<Response> {
    try {
      const actor = await resolveCurrentActor(request);
      if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id))
        throw new ValidationError("ID audit tidak valid.");
      const item = await this.detailUC.execute(actor, id);
      if (!item)
        return reply(
          ApiResponse.error("NOT_FOUND", "Log audit tidak ditemukan.", 404)
            .body,
          404,
        );
      return reply(ApiResponse.success(item).body);
    } catch (e) {
      return failed(e);
    }
  }
}
