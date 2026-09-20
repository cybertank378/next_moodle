import { AppError } from "./AppError";

export interface MoodleErrorParams {
  readonly message: string;
  readonly code?: string;
  readonly statusCode?: number;
  readonly moodleErrorCode?: string;
  readonly moodleException?: string;
  readonly requestId?: string;
  readonly details?: unknown;
  readonly cause?: unknown;
}

export class MoodleError extends AppError {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly moodleErrorCode?: string;
  public readonly moodleException?: string;
  public readonly requestId?: string;

  constructor(params: MoodleErrorParams) {
    super(params.message, { details: params.details, cause: params.cause });
    this.code = params.code ?? "MOODLE_ERROR";
    this.statusCode = params.statusCode ?? 502;
    this.moodleErrorCode = params.moodleErrorCode;
    this.moodleException = params.moodleException;
    this.requestId = params.requestId;
  }
}
