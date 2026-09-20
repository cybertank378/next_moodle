import type { TenantStatus } from "../types/TenantStatus";

export interface CreateTenantRequestDTO {
  readonly slug: string;
  readonly name: string;
  readonly moodleBaseUrl: string;
  readonly moodleToken: string;
  readonly moodleServiceShortname?: string | null;
  readonly status?: TenantStatus;
}
