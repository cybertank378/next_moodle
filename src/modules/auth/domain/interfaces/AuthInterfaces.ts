import type { CurrentActor } from "@/core/auth/CurrentActor";

export interface LoginTenant {
  readonly tenantId: string;
  readonly slug: string;
  readonly moodleUrl: string;
  readonly status: "ACTIVE" | "MAINTENANCE" | "SUSPENDED";
}

export interface LoginCredentials {
  readonly tenant: string;
  readonly username: string;
  readonly password: string;
}

export interface MoodleSiteInfo {
  readonly userId: number;
  readonly username: string;
  readonly fullName?: string;
  readonly email?: string;
}

export interface MoodleLoginResult {
  readonly token: string;
  readonly siteInfo: MoodleSiteInfo;
}

export interface TenantAuthResolver {
  resolveLoginTenant(identifier: string): Promise<LoginTenant>;
}

export interface MoodleAuthProvider {
  authenticateStudent(input: {
    readonly tenant: LoginTenant;
    readonly username: string;
    readonly password: string;
  }): Promise<MoodleLoginResult>;
}

export interface AppSessionPayload {
  readonly actor: CurrentActor;
  readonly moodleToken: string;
}

export interface CreatedAppSession {
  readonly cookieValue: string;
  readonly expiresAt: Date;
}

export interface AuthSessionManager {
  createSession(payload: AppSessionPayload): Promise<CreatedAppSession>;
  resolveSession(cookieValue: string): Promise<AppSessionPayload>;
  refreshSession(cookieValue: string): Promise<CreatedAppSession>;
  revokeSession(cookieValue: string): Promise<void>;
  revokeAllForActor(actorId: string): Promise<void>;
}
