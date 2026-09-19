export interface TenantContext {
  readonly tenantId: string;
  readonly slug: string;
  readonly name: string;
  readonly moodleUrl: string;
  readonly moodleToken: string;
  readonly isActive: boolean;
}
