export interface Session {
  readonly id: string;
  readonly userId: string;
  readonly tenantId: string;
  readonly expiresAt: Date;
  readonly roles?: readonly string[];
}
