import { AppError } from "./AppError";

export class MoodleError extends AppError {
  public readonly code = "MOODLE_ERROR";
  public readonly statusCode = 502;
  public readonly moodleErrorCode?: string;

  constructor(
    moodleErrorCode?: string,
    message = "Moodle upstream error",
    details?: unknown,
  ) {
    super(message, details);
    this.moodleErrorCode = moodleErrorCode;
  }
}
