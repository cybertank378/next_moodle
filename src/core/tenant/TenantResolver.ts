import type { TenantContext } from "./TenantContext";

export interface TenantResolver {
  resolveFromIdentifier(identifier: string): Promise<TenantContext | null>;
}
