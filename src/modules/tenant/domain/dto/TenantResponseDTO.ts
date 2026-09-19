import type { TenantStatus } from "../types/TenantStatus";

export interface TenantResponseDTO {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly status: TenantStatus;
  readonly createdAt: string;
}
