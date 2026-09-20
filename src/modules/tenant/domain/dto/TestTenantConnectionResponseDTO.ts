export interface TestTenantConnectionResponseDTO {
  readonly success: boolean;
  readonly message: string;
  readonly moodleVersion?: string;
  readonly siteName?: string;
}
