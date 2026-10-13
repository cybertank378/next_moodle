import "server-only";

import { ROUTES } from "@/libs/routes";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";
import { ScheduleSessionEntity } from "@/modules/schedule/domain/entity/ScheduleSessionEntity";
import type {
  ScheduleQueryOptions,
  ScheduleRepositoryInterface,
} from "@/modules/schedule/domain/interfaces/ScheduleRepositoryInterface";
import type { ScheduleSessionStatus } from "@/modules/schedule/domain/types/ScheduleTypes";

export class MoodleScheduleRepository implements ScheduleRepositoryInterface {
  constructor(
    private readonly courseRepo: CourseRepositoryInterface,
    private readonly quizRepo: QuizRepositoryInterface,
  ) {}

  async getStudentSchedule(
    options: ScheduleQueryOptions,
  ): Promise<ScheduleSessionEntity[]> {
    const { tenantId, moodleUserId, from, to, types, courseId, client } =
      options;

    const sessions: ScheduleSessionEntity[] = [];

    // Filter check: If types are passed and EXAM is not included, skip quizzes
    const shouldFetchExams = !types || types.includes("EXAM");

    if (shouldFetchExams) {
      // 1. Get enrolled courses
      const enrolledCourses = await this.courseRepo.getUserCourses({
        tenantId,
        moodleUserId,
        client,
      });

      let targetCourseIds = enrolledCourses.map((c) => c.id);
      if (courseId !== undefined) {
        // Enrolled check: student must be enrolled in courseId
        if (!targetCourseIds.includes(courseId)) {
          return [];
        }
        targetCourseIds = [courseId];
      }

      if (targetCourseIds.length > 0) {
        // 2. Fetch quizzes for target courses
        const quizzes = await this.quizRepo.getQuizzesByCourses({
          tenantId,
          courseIds: targetCourseIds,
          client,
        });

        const fromTimeMs = from.getTime();
        const toTimeMs = to.getTime();
        const nowMs = Date.now();

        for (const quiz of quizzes) {
          const startTimestampMs = quiz.timeOpen
            ? quiz.timeOpen * 1000
            : quiz.timeClose
              ? quiz.timeClose * 1000
              : null;

          if (!startTimestampMs) continue; // Skip quizzes with no schedule

          const endTimestampMs = quiz.timeClose
            ? quiz.timeClose * 1000
            : quiz.timeLimitSeconds
              ? startTimestampMs + quiz.timeLimitSeconds * 1000
              : startTimestampMs + 60 * 60 * 1000; // default 1 hour if unspecified

          // Check overlap with [from, to] window
          if (startTimestampMs <= toTimeMs && endTimestampMs >= fromTimeMs) {
            const course = enrolledCourses.find((c) => c.id === quiz.courseId);
            const courseName = course ? course.fullName : undefined;
            const subjectCode = course ? course.shortName : undefined;

            let status: ScheduleSessionStatus = "SCHEDULED";
            if (nowMs >= startTimestampMs && nowMs <= endTimestampMs) {
              status = "IN_PROGRESS";
            } else if (nowMs > endTimestampMs) {
              status = "COMPLETED";
            }

            sessions.push(
              new ScheduleSessionEntity(`quiz-${quiz.id}`, tenantId, {
                id: `quiz-${quiz.id}`,
                sessionType: "EXAM",
                title: quiz.name,
                startsAt: new Date(startTimestampMs).toISOString(),
                endsAt: new Date(endTimestampMs).toISOString(),
                allDay: false,
                courseId: quiz.courseId,
                courseName,
                subjectCode,
                status,
                detailRoute: ROUTES.DASHBOARD.EXAM_DETAIL(quiz.id),
                description: quiz.intro || undefined,
              }),
            );
          }
        }
      }
    }

    return sessions;
  }

  async getSessionById(options: {
    tenantId: string;
    moodleUserId: number;
    sessionId: string;
    client: ScheduleQueryOptions["client"];
  }): Promise<ScheduleSessionEntity | null> {
    const { tenantId, moodleUserId, sessionId, client } = options;

    if (sessionId.startsWith("quiz-")) {
      const quizIdStr = sessionId.replace("quiz-", "");
      const quizId = parseInt(quizIdStr, 10);
      if (Number.isNaN(quizId)) return null;

      const enrolledCourses = await this.courseRepo.getUserCourses({
        tenantId,
        moodleUserId,
        client,
      });

      const courseIds = enrolledCourses.map((c) => c.id);
      if (courseIds.length === 0) return null;

      const quiz = await this.quizRepo.getQuizById({
        tenantId,
        quizId,
        client,
      });

      if (!quiz || !courseIds.includes(quiz.courseId)) {
        return null; // Not found or not enrolled
      }

      const startTimestampMs = quiz.timeOpen
        ? quiz.timeOpen * 1000
        : quiz.timeClose
          ? quiz.timeClose * 1000
          : Date.now();

      const endTimestampMs = quiz.timeClose
        ? quiz.timeClose * 1000
        : quiz.timeLimitSeconds
          ? startTimestampMs + quiz.timeLimitSeconds * 1000
          : startTimestampMs + 60 * 60 * 1000;

      const nowMs = Date.now();
      let status: ScheduleSessionStatus = "SCHEDULED";
      if (nowMs >= startTimestampMs && nowMs <= endTimestampMs) {
        status = "IN_PROGRESS";
      } else if (nowMs > endTimestampMs) {
        status = "COMPLETED";
      }

      const course = enrolledCourses.find((c) => c.id === quiz.courseId);

      return new ScheduleSessionEntity(`quiz-${quiz.id}`, tenantId, {
        id: `quiz-${quiz.id}`,
        sessionType: "EXAM",
        title: quiz.name,
        startsAt: new Date(startTimestampMs).toISOString(),
        endsAt: new Date(endTimestampMs).toISOString(),
        allDay: false,
        courseId: quiz.courseId,
        courseName: course?.fullName,
        subjectCode: course?.shortName,
        status,
        detailRoute: ROUTES.DASHBOARD.EXAM_DETAIL(quiz.id),
        description: quiz.intro || undefined,
      });
    }

    return null;
  }
}
