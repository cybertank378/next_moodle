import type { TenantContext } from "@/core/tenant/TenantContext";

export interface TenantResolver {
  resolveFromIdentifier(identifier: string): Promise<TenantContext | null>;
}
