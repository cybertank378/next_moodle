import type { MoodleCredentials } from "./types";

export interface MoodleCredentialProvider {
  getCredentials(tenantId: string): Promise<MoodleCredentials>;
}
