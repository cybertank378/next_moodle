import "server-only";

import type { CurrentActor } from "@/core/auth/CurrentActor";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { GetNotificationsUseCase } from "../../application/usecases/GetNotificationsUseCase";
import type { GetUnreadCountUseCase } from "../../application/usecases/GetUnreadCountUseCase";
import type { MarkNotificationReadUseCase } from "../../application/usecases/MarkNotificationReadUseCase";
import type { MarkAllReadUseCase } from "../../application/usecases/MarkAllReadUseCase";
import { parseNotificationQuery } from "../validators/notificationValidator";
import { NotificationScope } from "../../domain/value-object/NotificationScope";

function respond(body: unknown, status: number): Response {
  return Response.json({ success: status < 400, ...( status >= 400 ? { error: body } : { data: body } ) }, { status });
}

export class NotificationController {
  constructor(
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly getUnreadCountUseCase: GetUnreadCountUseCase,
    private readonly markReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllReadUseCase: MarkAllReadUseCase,
  ) {}

  async getNotifications(req: Request): Promise<Response> {
    const actor = await resolveCurrentActor(req).catch(() => null);
    if (!actor) {
      return Response.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
        { status: 401 },
      );
    }

    try {
      const searchParams = new URL(req.url).searchParams;
      const query = parseNotificationQuery(searchParams);

      const scope = NotificationScope.forRecipient({
        recipientId: actor.userId,
        role: actor.role,
        tenantId: actor.tenantId,
      });

      const result = await this.getNotificationsUseCase.execute({
        scope,
        tab: query.tab,
        page: query.page,
        limit: query.limit,
      });

      return Response.json({ success: true, data: result }, { status: 200 });
    } catch (error) {
      const r = mapErrorToHttpResponse(error);
      return Response.json(r.body, { status: r.status });
    }
  }

  async getUnreadCount(req: Request): Promise<Response> {
    const actor = await resolveCurrentActor(req).catch(() => null);
    if (!actor) {
      return Response.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
        { status: 401 },
      );
    }

    try {
      const scope = NotificationScope.forRecipient({
        recipientId: actor.userId,
        role: actor.role,
        tenantId: actor.tenantId,
      });

      const unreadCount = await this.getUnreadCountUseCase.execute({
        scope,
      });

      return Response.json({ success: true, data: { unreadCount } }, { status: 200 });
    } catch (error) {
      const r = mapErrorToHttpResponse(error);
      return Response.json(r.body, { status: r.status });
    }
  }

  async markAsRead(
    notificationId: string,
    req: Request,
  ): Promise<Response> {
    const actor = await resolveCurrentActor(req).catch(() => null);
    if (!actor) {
      return Response.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
        { status: 401 },
      );
    }

    if (!notificationId || !notificationId.trim()) {
      return Response.json(
        { success: false, error: { code: "BAD_REQUEST", message: "ID Notifikasi tidak valid." } },
        { status: 400 },
      );
    }

    try {
      const scope = NotificationScope.forRecipient({
        recipientId: actor.userId,
        role: actor.role,
        tenantId: actor.tenantId,
      });

      await this.markReadUseCase.execute({
        notificationId,
        scope,
      });

      return Response.json(
        { success: true, data: { message: "Notifikasi telah ditandai sebagai dibaca." } },
        { status: 200 },
      );
    } catch (error) {
      const r = mapErrorToHttpResponse(error);
      return Response.json(r.body, { status: r.status });
    }
  }

  async markAllAsRead(req: Request): Promise<Response> {
    const actor = await resolveCurrentActor(req).catch(() => null);
    if (!actor) {
      return Response.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } },
        { status: 401 },
      );
    }

    try {
      const scope = NotificationScope.forRecipient({
        recipientId: actor.userId,
        role: actor.role,
        tenantId: actor.tenantId,
      });

      const markedCount = await this.markAllReadUseCase.execute({
        scope,
      });

      return Response.json(
        { success: true, data: { markedCount } },
        { status: 200 },
      );
    } catch (error) {
      const r = mapErrorToHttpResponse(error);
      return Response.json(r.body, { status: r.status });
    }
  }
}
