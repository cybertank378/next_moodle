/**
 * Application & Multi-Tenant Operational Enums
 *
 * Centralized enum definitions decoupled from Prisma to prevent
 * database infrastructure types from leaking into domain or presentation layers.
 */

export enum TenantStatus {
  ACTIVE = "ACTIVE",
  MAINTENANCE = "MAINTENANCE",
  SUSPENDED = "SUSPENDED",
}

export type TenantStatusType = (typeof TenantStatus)[keyof typeof TenantStatus];
