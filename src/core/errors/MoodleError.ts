import { AppError } from "./AppError";

export class MoodleError extends AppError {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly moodleErrorCode?: string;

  constructor(params: {
    message: string;
    code?: string;
    statusCode?: number;
    moodleErrorCode?: string;
    details?: unknown;
  }) {
    super(params.message, params.details);
    this.code = params.code ?? "MOODLE_ERROR";
    this.statusCode = params.statusCode ?? 502;
    this.moodleErrorCode = params.moodleErrorCode;
  }
}
