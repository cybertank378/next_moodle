import type { ILogger } from "../logger";

export interface MoodleClientConfig {
  readonly baseUrl: string;
  readonly token: string;
  readonly timeoutMs?: number;
  readonly logger?: ILogger;
  readonly requestId?: string;
  readonly tenantId?: string;
  readonly fetcher?: typeof fetch;
}
