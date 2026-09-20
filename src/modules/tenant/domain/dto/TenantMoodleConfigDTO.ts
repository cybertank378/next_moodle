export interface TenantMoodleConfigDTO {
  readonly baseUrl: string;
  readonly serviceShortname: string | null;
  readonly configured: boolean;
}
