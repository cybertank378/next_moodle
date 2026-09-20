import type { TenantMoodleConfiguration } from "@/modules/tenant/domain/types/TenantMoodleConfiguration";
import type { TenantStatus } from "@/modules/tenant/domain/types/TenantStatus";

export interface TenantDetailResponseDTO {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly status: TenantStatus;
  readonly moodle: TenantMoodleConfiguration;
  readonly createdAt: string;
  readonly updatedAt: string;
}
