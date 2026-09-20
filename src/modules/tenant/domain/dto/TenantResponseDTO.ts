import type { TenantStatus } from "@/modules/tenant/domain/types/TenantStatus";
import type { TenantMoodleConfigDTO } from "./TenantMoodleConfigDTO";

export interface TenantResponseDTO {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly status: TenantStatus;
  readonly moodle?: TenantMoodleConfigDTO;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}
