import { NextResponse } from "next/server";
import "server-only";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { ValidationError } from "@/core/errors/ValidationError";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import { requireAuditCleanupAdmin } from "@/modules/audit/application/services/AuditRetentionService";
import type { GetAuditDetailUseCase } from "@/modules/audit/application/usecases/GetAuditDetailUseCase";
import type { GetAuditListUseCase } from "@/modules/audit/application/usecases/GetAuditListUseCase";
import { parseAuditQuery } from "@/modules/audit/domain/builder/AuditQueryBuilder";
import { purgeExpiredAuditLogs } from "@/modules/audit/infrastructure/repo/AuditCleanupRepository";
import { getAuditRetentionOverview } from "@/modules/audit/infrastructure/repo/AuditRetentionOverview";
import { recordSaasAudit } from "@/modules/audit/infrastructure/repo/SaasAuditWriter";

const HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie, Authorization",
};
const reply = (body: unknown, status = 200): NextResponse =>
  NextResponse.json(body, { status, headers: HEADERS });
const failed = (e: unknown) => {
  const r = mapErrorToHttpResponse(e);
  return reply(r.body, r.status);
};
export class AuditController {
  constructor(
    private readonly listUC: GetAuditListUseCase,
    private readonly detailUC: GetAuditDetailUseCase,
  ) {}
  async list(request: Request): Promise<NextResponse> {
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
  async detail(request: Request, id: string): Promise<NextResponse> {
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
  async retention(request: Request): Promise<NextResponse> {
    try {
      const actor = await resolveCurrentActor(request);
      requireAuditCleanupAdmin(actor);
      return reply(ApiResponse.success(await getAuditRetentionOverview()).body);
    } catch (e) {
      return failed(e);
    }
  }

  async cleanup(request: Request): Promise<NextResponse> {
    try {
      const actor = await resolveCurrentActor(request);
      requireAuditCleanupAdmin(actor);
      const result = await purgeExpiredAuditLogs();
      await recordSaasAudit({
        actor,
        tenantId: null,
        action: "audit.cleanup.manual",
        resource: "saas_audit_logs",
        details: { event: "audit.cleanup", recordCount: result.deleted },
      });
      return reply(ApiResponse.success(result).body);
    } catch (e) {
      return failed(e);
    }
  }

  async cronAuditRetention(req: Request): Promise<NextResponse> {
    const secret = process.env.AUDIT_RETENTION_CRON_SECRET;
    const authorized = Boolean(
      secret && req.headers.get("authorization") === `Bearer ${secret}`,
    );
    if (!authorized) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Cron authorization required.",
          },
        },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    try {
      const result = await purgeExpiredAuditLogs();
      await recordSaasAudit({
        actor: {
          userId: "system:audit-retention",
          username: "system:audit-retention",
          role: "SYSTEM",
          tenantId: null,
        },
        tenantId: null,
        action: "audit.cleanup.automatic",
        resource: "saas_audit_logs",
        details: { event: "audit.cleanup", recordCount: result.deleted },
      });
      return NextResponse.json(
        { success: true, data: result },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch (e) {
      return failed(e);
    }
  }
}
