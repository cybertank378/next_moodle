// Files: src/modules/notification/infrastructure/http/NotificationManagementController.ts

import "server-only";

import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import type { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { GetNotificationCampaignListUseCase } from "@/modules/notification/application/usecases/GetNotificationCampaignListUseCase";
import type { GetNotificationCampaignByIdUseCase } from "@/modules/notification/application/usecases/GetNotificationCampaignByIdUseCase";
import type { CreateNotificationCampaignUseCase } from "@/modules/notification/application/usecases/CreateNotificationCampaignUseCase";
import type { UpdateNotificationCampaignUseCase } from "@/modules/notification/application/usecases/UpdateNotificationCampaignUseCase";
import type { DeleteNotificationDraftUseCase } from "@/modules/notification/application/usecases/DeleteNotificationDraftUseCase";
import type { PreviewNotificationAudienceUseCase } from "@/modules/notification/application/usecases/PreviewNotificationAudienceUseCase";
import type { GetNotificationRecipientOptionsUseCase } from "@/modules/notification/application/usecases/GetNotificationRecipientOptionsUseCase";
import type { SendNotificationCampaignUseCase } from "@/modules/notification/application/usecases/SendNotificationCampaignUseCase";
import type { ScheduleNotificationCampaignUseCase } from "@/modules/notification/application/usecases/ScheduleNotificationCampaignUseCase";
import type { CancelNotificationCampaignUseCase } from "@/modules/notification/application/usecases/CancelNotificationCampaignUseCase";
import type { ArchiveNotificationCampaignUseCase } from "@/modules/notification/application/usecases/ArchiveNotificationCampaignUseCase";
import type { RetryNotificationDeliveryUseCase } from "@/modules/notification/application/usecases/RetryNotificationDeliveryUseCase";
import type { GetNotificationDeliveryReportUseCase } from "@/modules/notification/application/usecases/GetNotificationDeliveryReportUseCase";
import type { RegisterNotificationDeviceUseCase } from "@/modules/notification/application/usecases/RegisterNotificationDeviceUseCase";
import type { UnregisterNotificationDeviceUseCase } from "@/modules/notification/application/usecases/UnregisterNotificationDeviceUseCase";
import { NotificationCampaignMapper } from "@/modules/notification/domain/mapper/NotificationCampaignMapper";
import {
  NotificationDispatchStatus,
} from "@/modules/notification/domain/types/NotificationTypes";

function respond(response: ApiResponse<unknown>): Response {
  return Response.json(response.body, { status: response.status });
}

function jsonSuccess(data: unknown, status = 200): Response {
  return Response.json({ success: true, data }, { status });
}

export class NotificationManagementController {
  constructor(
    private readonly getListUseCase: GetNotificationCampaignListUseCase,
    private readonly getByIdUseCase: GetNotificationCampaignByIdUseCase,
    private readonly createUseCase: CreateNotificationCampaignUseCase,
    private readonly updateUseCase: UpdateNotificationCampaignUseCase,
    private readonly deleteDraftUseCase: DeleteNotificationDraftUseCase,
    private readonly previewAudienceUseCase: PreviewNotificationAudienceUseCase,
    private readonly getRecipientOptionsUseCase: GetNotificationRecipientOptionsUseCase,
    private readonly sendUseCase: SendNotificationCampaignUseCase,
    private readonly scheduleUseCase: ScheduleNotificationCampaignUseCase,
    private readonly cancelUseCase: CancelNotificationCampaignUseCase,
    private readonly archiveUseCase: ArchiveNotificationCampaignUseCase,
    private readonly retryUseCase: RetryNotificationDeliveryUseCase,
    private readonly getDeliveryReportUseCase: GetNotificationDeliveryReportUseCase,
    private readonly registerDeviceUseCase: RegisterNotificationDeviceUseCase,
    private readonly unregisterDeviceUseCase: UnregisterNotificationDeviceUseCase,
  ) {}

  private async getActor(req: Request) {
    const actor = await resolveCurrentActor(req).catch(() => null);
    if (!actor) {
      throw new Error("UNAUTHORIZED");
    }
    return {
      id: actor.userId,
      role: actor.role,
      tenantId: actor.tenantId,
    };
  }

  async listCampaigns(req: Request): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      const { searchParams } = new URL(req.url);
      const search = searchParams.get("search") || undefined;
      const statusParam = searchParams.get("status");
      const isArchivedParam = searchParams.get("isArchived");
      const page = Number(searchParams.get("page")) || 1;
      const limit = Number(searchParams.get("limit")) || 10;

      const dispatchStatus =
        statusParam &&
        Object.values(NotificationDispatchStatus).includes(
          statusParam as NotificationDispatchStatus,
        )
          ? (statusParam as NotificationDispatchStatus)
          : undefined;

      const isArchived = isArchivedParam === "true" ? true : isArchivedParam === "false" ? false : undefined;

      const { campaigns, total } = await this.getListUseCase.execute(
        { search, dispatchStatus, isArchived, page, limit },
        actor,
      );

      return jsonSuccess({
        items: campaigns.map((c) => NotificationCampaignMapper.toResponseDto(c)),
        total,
        page,
        limit,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async getCampaign(req: Request, id: string): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      const { campaign, summary } = await this.getByIdUseCase.execute(id, actor);
      return jsonSuccess(NotificationCampaignMapper.toResponseDto(campaign, summary));
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async createCampaign(req: Request): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      const body = await req.json();
      const created = await this.createUseCase.execute(body, actor);
      return jsonSuccess(NotificationCampaignMapper.toResponseDto(created), 201);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async updateCampaign(req: Request, id: string): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      const body = await req.json();
      const updated = await this.updateUseCase.execute(id, body, actor);
      return jsonSuccess(NotificationCampaignMapper.toResponseDto(updated));
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async deleteDraft(req: Request, id: string): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      await this.deleteDraftUseCase.execute(id, actor);
      return jsonSuccess({ message: "Draft berhasil dihapus." });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async previewAudience(req: Request): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      const body = await req.json();
      const result = await this.previewAudienceUseCase.execute(body, actor);
      return jsonSuccess(result);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async getRecipientOptions(req: Request): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      const result = await this.getRecipientOptionsUseCase.execute(actor);
      return jsonSuccess(result);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async sendCampaign(req: Request, id: string): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      const sent = await this.sendUseCase.execute(id, actor);
      return jsonSuccess(NotificationCampaignMapper.toResponseDto(sent), 202);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async scheduleCampaign(req: Request, id: string): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      const body = await req.json();
      const scheduled = await this.scheduleUseCase.execute(id, body, actor);
      return jsonSuccess(NotificationCampaignMapper.toResponseDto(scheduled));
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async cancelCampaign(req: Request, id: string): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      const cancelled = await this.cancelUseCase.execute(id, actor);
      return jsonSuccess(NotificationCampaignMapper.toResponseDto(cancelled));
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async archiveCampaign(req: Request, id: string): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      const archived = await this.archiveUseCase.execute(id, actor);
      return jsonSuccess(NotificationCampaignMapper.toResponseDto(archived));
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async retryDelivery(req: Request, id: string): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      const result = await this.retryUseCase.execute(id, actor);
      return jsonSuccess(result);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async getDeliveryReport(req: Request, id: string): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      const { searchParams } = new URL(req.url);
      const page = Number(searchParams.get("page")) || 1;
      const limit = Number(searchParams.get("limit")) || 20;

      const { deliveries, total, summary } = await this.getDeliveryReportUseCase.execute(
        id,
        actor,
        { page, limit },
      );

      return jsonSuccess({
        items: deliveries.map(NotificationCampaignMapper.toDeliveryDto),
        total,
        summary,
        page,
        limit,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async registerDevice(req: Request): Promise<Response> {
    try {
      const actor = await this.getActor(req);
      const body = await req.json();
      await this.registerDeviceUseCase.execute(body, actor);
      return jsonSuccess({ message: "Perangkat berhasil didaftarkan." });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
          { status: 401 },
        );
      }
      return respond(mapErrorToHttpResponse(err));
    }
  }

  async unregisterDevice(req: Request): Promise<Response> {
    try {
      const body = await req.json();
      await this.unregisterDeviceUseCase.execute(body.token);
      return jsonSuccess({ message: "Perangkat berhasil dihapus." });
    } catch (err: unknown) {
      return respond(mapErrorToHttpResponse(err));
    }
  }
}
