import type { MoodleWarning } from "./MoodleWarning";

export interface MoodleResponseWithWarnings {
  readonly warnings?: readonly MoodleWarning[];
}

export type MoodleResponse<T = unknown> = T & {
  readonly warnings?: readonly MoodleWarning[];
};
