import type { TenantStatus } from "@/modules/tenant/domain/types/TenantStatus";

export interface UpdateTenantRequestDTO {
  readonly name?: string;
  readonly moodleBaseUrl?: string;
  readonly moodleToken?: string;
  readonly moodleServiceShortname?: string | null;
  readonly status?: TenantStatus;
}
