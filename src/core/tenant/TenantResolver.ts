import type { TenantContext } from "./TenantContext";

export interface TenantResolutionInput {
  readonly identifier: string;
  readonly host?: string;
  readonly headers?: Headers;
}

export interface TenantResolver {
  resolve(input: TenantResolutionInput): Promise<TenantContext | null>;
}
