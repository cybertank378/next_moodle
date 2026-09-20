import type { TenantContext } from "./TenantContext";

export interface TenantResolutionInput {
  readonly hostname: string;
  readonly identifier?: string;
  readonly headers?: Headers;
}

export interface TenantResolver {
  resolve(input: TenantResolutionInput): Promise<TenantContext | null>;
}
