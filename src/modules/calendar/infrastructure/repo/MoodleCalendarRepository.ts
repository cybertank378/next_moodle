import "server-only";

import { ROUTES } from "@/libs/routes";
import { CalendarEventEntity } from "@/modules/calendar/domain/entity/CalendarEventEntity";
import type {
  CalendarEventQueryOptions,
  CalendarRepositoryInterface,
} from "@/modules/calendar/domain/interfaces/CalendarRepositoryInterface";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";

export class MoodleCalendarRepository implements CalendarRepositoryInterface {
  constructor(
    private readonly courseRepo: CourseRepositoryInterface,
    private readonly quizRepo: QuizRepositoryInterface,
  ) {}

  async getStudentCalendarEvents(
    options: CalendarEventQueryOptions,
  ): Promise<CalendarEventEntity[]> {
    const { tenantId, moodleUserId, from, to, types, client } = options;

    const events: CalendarEventEntity[] = [];

    // Filter check: If specific types requested and QUIZ_EXAM is not in the list, skip quizzes
    const shouldFetchQuizzes = !types || types.includes("QUIZ_EXAM");

    if (shouldFetchQuizzes) {
      // 1. Get enrolled courses for student using student Moodle client
      const enrolledCourses = await this.courseRepo.getUserCourses({
        tenantId,
        moodleUserId,
        client,
      });

      const courseIds = enrolledCourses.map((c) => c.id);

      if (courseIds.length > 0) {
        // 2. Fetch quizzes for enrolled courses using student Moodle client
        const quizzes = await this.quizRepo.getQuizzesByCourses({
          tenantId,
          courseIds,
          client,
        });

        const fromTimeMs = from.getTime();
        const toTimeMs = to.getTime();

        for (const quiz of quizzes) {
          // If quiz has timeOpen or timeClose, determine effective event time
          const startTimestampMs = quiz.timeOpen
            ? quiz.timeOpen * 1000
            : quiz.timeClose
              ? quiz.timeClose * 1000
              : null;

          if (!startTimestampMs) continue; // Skip quizzes with no schedule

          // Check if event falls within [from, to] window
          const endTimestampMs = quiz.timeClose
            ? quiz.timeClose * 1000
            : quiz.timeLimitSeconds
              ? startTimestampMs + quiz.timeLimitSeconds * 1000
              : null;

          const eventEndMs = endTimestampMs ?? startTimestampMs;

          // Event overlaps with range if start <= to and end >= from
          if (startTimestampMs <= toTimeMs && eventEndMs >= fromTimeMs) {
            const course = enrolledCourses.find((c) => c.id === quiz.courseId);
            const courseName = course ? course.fullName : undefined;

            events.push(
              new CalendarEventEntity(`quiz-${quiz.id}`, tenantId, {
                id: `quiz-${quiz.id}`,
                sourceType: "QUIZ_EXAM",
                title: quiz.name,
                startAt: new Date(startTimestampMs).toISOString(),
                endAt: endTimestampMs
                  ? new Date(endTimestampMs).toISOString()
                  : null,
                allDay: false,
                courseId: quiz.courseId,
                courseName,
                relatedResourceId: quiz.id,
                description: quiz.intro || undefined,
                status: "OPEN",
                detailRoute: ROUTES.DASHBOARD.EXAM_DETAIL(quiz.id),
              }),
            );
          }
        }
      }
    }

    return events;
  }
}
