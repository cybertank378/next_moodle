import "server-only";

import { GetNotificationsUseCase } from "@/modules/notification/application/usecases/GetNotificationsUseCase";
import { GetUnreadCountUseCase } from "@/modules/notification/application/usecases/GetUnreadCountUseCase";
import { MarkNotificationReadUseCase } from "@/modules/notification/application/usecases/MarkNotificationReadUseCase";
import { MarkAllReadUseCase } from "@/modules/notification/application/usecases/MarkAllReadUseCase";
import { PrismaNotificationRepository } from "@/modules/notification/infrastructure/repo/PrismaNotificationRepository";
import { NotificationController } from "@/modules/notification/infrastructure/http/NotificationController";

let _controller: NotificationController | null = null;

export function getNotificationController(): NotificationController {
  if (!_controller) {
    const repo = new PrismaNotificationRepository();
    _controller = new NotificationController(
      new GetNotificationsUseCase(repo),
      new GetUnreadCountUseCase(repo),
      new MarkNotificationReadUseCase(repo),
      new MarkAllReadUseCase(repo),
    );
  }
  return _controller;
}
