import type { Session } from "./Session";

export interface SessionResolver {
  resolve(request: Request): Promise<Session | null>;
}
