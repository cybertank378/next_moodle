import type { TenantStatus } from "../types/TenantStatus";

export interface UpdateTenantRequestDTO {
  readonly name?: string;
  readonly moodleBaseUrl?: string;
  readonly moodleToken?: string;
  readonly moodleServiceShortname?: string | null;
  readonly status?: TenantStatus;
}
