export interface LogContext {
  readonly requestId?: string;
  readonly tenantId?: string;
  readonly actorId?: string;
  readonly event?: string;
  readonly [key: string]: unknown;
}
