export interface TenantMoodleConfiguration {
  readonly baseUrl: string;
  readonly serviceShortname: string | null;
  readonly configured: boolean;
  readonly connectionStatus?: "CONNECTED" | "FAILED" | "UNTESTED";
  readonly lastConnectionTestAt?: string;
  readonly moodleVersion?: string;
}
