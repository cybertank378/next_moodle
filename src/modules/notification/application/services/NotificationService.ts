import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import type {
  ArchiveNotificationCampaignInput,
  ArchiveNotificationCampaignUseCase,
} from "@/modules/notification/application/usecases/ArchiveNotificationCampaignUseCase";
import type {
  CancelNotificationCampaignInput,
  CancelNotificationCampaignUseCase,
} from "@/modules/notification/application/usecases/CancelNotificationCampaignUseCase";
import type {
  CreateNotificationCampaignInput,
  CreateNotificationCampaignUseCase,
} from "@/modules/notification/application/usecases/CreateNotificationCampaignUseCase";
import type { CreateNotificationUseCase } from "@/modules/notification/application/usecases/CreateNotificationUseCase";
import type {
  DeleteNotificationDraftInput,
  DeleteNotificationDraftUseCase,
} from "@/modules/notification/application/usecases/DeleteNotificationDraftUseCase";
import type {
  GetNotificationCampaignByIdInput,
  GetNotificationCampaignByIdOutput,
  GetNotificationCampaignByIdUseCase,
} from "@/modules/notification/application/usecases/GetNotificationCampaignByIdUseCase";
import type {
  GetNotificationCampaignListInput,
  GetNotificationCampaignListOutput,
  GetNotificationCampaignListUseCase,
} from "@/modules/notification/application/usecases/GetNotificationCampaignListUseCase";
import type {
  GetNotificationDeliveryReportInput,
  GetNotificationDeliveryReportOutput,
  GetNotificationDeliveryReportUseCase,
} from "@/modules/notification/application/usecases/GetNotificationDeliveryReportUseCase";
import type {
  GetNotificationRecipientOptionsInput,
  GetNotificationRecipientOptionsUseCase,
} from "@/modules/notification/application/usecases/GetNotificationRecipientOptionsUseCase";
import type { GetNotificationsUseCase } from "@/modules/notification/application/usecases/GetNotificationsUseCase";
import type { GetUnreadCountUseCase } from "@/modules/notification/application/usecases/GetUnreadCountUseCase";
import type { MarkAllReadUseCase } from "@/modules/notification/application/usecases/MarkAllReadUseCase";
import type { MarkNotificationReadUseCase } from "@/modules/notification/application/usecases/MarkNotificationReadUseCase";
import type {
  PreviewNotificationAudienceInput,
  PreviewNotificationAudienceUseCase,
} from "@/modules/notification/application/usecases/PreviewNotificationAudienceUseCase";
import type {
  RegisterNotificationDeviceInput,
  RegisterNotificationDeviceUseCase,
} from "@/modules/notification/application/usecases/RegisterNotificationDeviceUseCase";
import type {
  RetryNotificationDeliveryInput,
  RetryNotificationDeliveryUseCase,
} from "@/modules/notification/application/usecases/RetryNotificationDeliveryUseCase";
import type {
  ScheduleNotificationCampaignInput,
  ScheduleNotificationCampaignUseCase,
} from "@/modules/notification/application/usecases/ScheduleNotificationCampaignUseCase";
import type {
  SendNotificationCampaignInput,
  SendNotificationCampaignUseCase,
} from "@/modules/notification/application/usecases/SendNotificationCampaignUseCase";
import type {
  UnregisterNotificationDeviceInput,
  UnregisterNotificationDeviceUseCase,
} from "@/modules/notification/application/usecases/UnregisterNotificationDeviceUseCase";
import type {
  UpdateNotificationCampaignInput,
  UpdateNotificationCampaignUseCase,
} from "@/modules/notification/application/usecases/UpdateNotificationCampaignUseCase";
import type {
  NotificationAudiencePreviewResponseDto,
  NotificationRecipientOptionsResponseDto,
} from "@/modules/notification/domain/dto/NotificationCampaignResponseDto";
import type {
  CreateNotificationRequestDto,
  GetNotificationsRequestDto,
  GetUnreadCountRequestDto,
  MarkAllReadRequestDto,
  MarkNotificationReadRequestDto,
} from "@/modules/notification/domain/dto/NotificationRequestDto";
import type { PaginatedNotificationsResponseDto } from "@/modules/notification/domain/dto/NotificationResponseDto";
import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type { NotificationEntity } from "@/modules/notification/domain/entity/NotificationEntity";

export class NotificationService extends BaseService {
  constructor(
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly getUnreadCountUseCase: GetUnreadCountUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllReadUseCase: MarkAllReadUseCase,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly registerDeviceUseCase: RegisterNotificationDeviceUseCase,
    private readonly unregisterDeviceUseCase: UnregisterNotificationDeviceUseCase,
    private readonly getCampaignListUseCase: GetNotificationCampaignListUseCase,
    private readonly getCampaignByIdUseCase: GetNotificationCampaignByIdUseCase,
    private readonly createCampaignUseCase: CreateNotificationCampaignUseCase,
    private readonly updateCampaignUseCase: UpdateNotificationCampaignUseCase,
    private readonly sendCampaignUseCase: SendNotificationCampaignUseCase,
    private readonly scheduleCampaignUseCase: ScheduleNotificationCampaignUseCase,
    private readonly cancelCampaignUseCase: CancelNotificationCampaignUseCase,
    private readonly archiveCampaignUseCase: ArchiveNotificationCampaignUseCase,
    private readonly deleteDraftUseCase: DeleteNotificationDraftUseCase,
    private readonly getDeliveryReportUseCase: GetNotificationDeliveryReportUseCase,
    private readonly retryDeliveryUseCase: RetryNotificationDeliveryUseCase,
    private readonly previewAudienceUseCase: PreviewNotificationAudienceUseCase,
    private readonly getRecipientOptionsUseCase: GetNotificationRecipientOptionsUseCase,
  ) {
    super("NotificationService");
  }

  async getNotifications(
    dto: GetNotificationsRequestDto,
  ): Promise<Result<PaginatedNotificationsResponseDto, Error>> {
    return this.execute(() => this.getNotificationsUseCase.execute(dto));
  }

  async getUnreadCount(
    dto: GetUnreadCountRequestDto,
  ): Promise<Result<number, Error>> {
    return this.execute(() => this.getUnreadCountUseCase.execute(dto));
  }

  async markNotificationRead(
    dto: MarkNotificationReadRequestDto,
  ): Promise<Result<void, Error>> {
    return this.execute(() => this.markNotificationReadUseCase.execute(dto));
  }

  async markAllRead(
    dto: MarkAllReadRequestDto,
  ): Promise<Result<number, Error>> {
    return this.execute(() => this.markAllReadUseCase.execute(dto));
  }

  async createNotification(
    dto: CreateNotificationRequestDto,
  ): Promise<Result<NotificationEntity, Error>> {
    return this.execute(() => this.createNotificationUseCase.execute(dto));
  }

  async registerDevice(
    input: RegisterNotificationDeviceInput,
  ): Promise<Result<void, Error>> {
    return this.execute(() => this.registerDeviceUseCase.execute(input));
  }

  async unregisterDevice(
    input: UnregisterNotificationDeviceInput,
  ): Promise<Result<void, Error>> {
    return this.execute(() => this.unregisterDeviceUseCase.execute(input));
  }

  async getCampaignList(
    input: GetNotificationCampaignListInput,
  ): Promise<Result<GetNotificationCampaignListOutput, Error>> {
    return this.execute(() => this.getCampaignListUseCase.execute(input));
  }

  async getCampaignById(
    input: GetNotificationCampaignByIdInput,
  ): Promise<Result<GetNotificationCampaignByIdOutput, Error>> {
    return this.execute(() => this.getCampaignByIdUseCase.execute(input));
  }

  async createCampaign(
    input: CreateNotificationCampaignInput,
  ): Promise<Result<NotificationCampaignEntity, Error>> {
    return this.execute(() => this.createCampaignUseCase.execute(input));
  }

  async updateCampaign(
    input: UpdateNotificationCampaignInput,
  ): Promise<Result<NotificationCampaignEntity, Error>> {
    return this.execute(() => this.updateCampaignUseCase.execute(input));
  }

  async sendCampaign(
    input: SendNotificationCampaignInput,
  ): Promise<Result<NotificationCampaignEntity, Error>> {
    return this.execute(() => this.sendCampaignUseCase.execute(input));
  }

  async scheduleCampaign(
    input: ScheduleNotificationCampaignInput,
  ): Promise<Result<NotificationCampaignEntity, Error>> {
    return this.execute(() => this.scheduleCampaignUseCase.execute(input));
  }

  async cancelCampaign(
    input: CancelNotificationCampaignInput,
  ): Promise<Result<NotificationCampaignEntity, Error>> {
    return this.execute(() => this.cancelCampaignUseCase.execute(input));
  }

  async archiveCampaign(
    input: ArchiveNotificationCampaignInput,
  ): Promise<Result<NotificationCampaignEntity, Error>> {
    return this.execute(() => this.archiveCampaignUseCase.execute(input));
  }

  async deleteDraft(
    input: DeleteNotificationDraftInput,
  ): Promise<Result<void, Error>> {
    return this.execute(() => this.deleteDraftUseCase.execute(input));
  }

  async getDeliveryReport(
    input: GetNotificationDeliveryReportInput,
  ): Promise<Result<GetNotificationDeliveryReportOutput, Error>> {
    return this.execute(() => this.getDeliveryReportUseCase.execute(input));
  }

  async retryDelivery(
    input: RetryNotificationDeliveryInput,
  ): Promise<Result<{ retriedCount: number }, Error>> {
    return this.execute(() => this.retryDeliveryUseCase.execute(input));
  }

  async previewAudience(
    input: PreviewNotificationAudienceInput,
  ): Promise<Result<NotificationAudiencePreviewResponseDto, Error>> {
    return this.execute(() => this.previewAudienceUseCase.execute(input));
  }

  async getRecipientOptions(
    input: GetNotificationRecipientOptionsInput,
  ): Promise<Result<NotificationRecipientOptionsResponseDto, Error>> {
    return this.execute(() => this.getRecipientOptionsUseCase.execute(input));
  }
}
