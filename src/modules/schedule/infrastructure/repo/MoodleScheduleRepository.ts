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

  async getTenantSchedule(
    options: ScheduleQueryOptions,
  ): Promise<ScheduleSessionEntity[]> {
    const { tenantId, from, to, types, courseId, client } = options;

    const sessions: ScheduleSessionEntity[] = [];
    const shouldFetchExams = !types || types.includes("EXAM");

    if (shouldFetchExams) {
      // For Tenant, fetch courses of the tenant
      const tenantCourses = await this.courseRepo.getTenantCourses({
        tenantId,
        client,
      });

      let targetCourseIds = tenantCourses.map((c) => c.id);
      if (courseId !== undefined) {
        if (!targetCourseIds.includes(courseId)) {
          return [];
        }
        targetCourseIds = [courseId];
      }

      if (targetCourseIds.length > 0) {
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

          if (!startTimestampMs) continue;

          const endTimestampMs = quiz.timeClose
            ? quiz.timeClose * 1000
            : quiz.timeLimitSeconds
              ? startTimestampMs + quiz.timeLimitSeconds * 1000
              : startTimestampMs + 60 * 60 * 1000;

          if (startTimestampMs <= toTimeMs && endTimestampMs >= fromTimeMs) {
            const course = tenantCourses.find((c) => c.id === quiz.courseId);
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

    // Also fetch local Prisma schedule sessions
    try {
      const { prisma } = await import("@/libs/prisma");
      const localSessions = await prisma.tenantScheduleSession.findMany({
        where: {
          tenantId,
          ...(courseId !== undefined ? { courseId } : {}),
          startsAt: { lte: to },
          endsAt: { gte: from },
        },
      });

      for (const row of localSessions) {
        if (types && !types.includes(row.sessionType as any)) continue;

        sessions.push(
          new ScheduleSessionEntity(row.id, tenantId, {
            id: row.id,
            sessionType: row.sessionType as any,
            title: row.title,
            startsAt: row.startsAt.toISOString(),
            endsAt: row.endsAt.toISOString(),
            allDay: row.allDay,
            courseId: row.courseId,
            courseName: row.courseName || undefined,
            subjectCode: row.subjectCode || undefined,
            room: row.room || undefined,
            instructor: row.instructor || undefined,
            classGroup: row.classGroup || undefined,
            status: row.status as ScheduleSessionStatus,
            description: row.description || undefined,
            isPublished: row.isPublished,
            detailRoute: `${ROUTES.DASHBOARD.SCHEDULE}/${row.id}`,
          }),
        );
      }
    } catch (err) {
      console.warn(
        "[ScheduleRepo] Error querying local schedule sessions:",
        err,
      );
    }

    return sessions;
  }

  async getTeacherSchedule(
    options: ScheduleQueryOptions,
  ): Promise<ScheduleSessionEntity[]> {
    const studentSessions = await this.getStudentSchedule(options);

    // Also include local sessions for the tenant
    try {
      const { prisma } = await import("@/libs/prisma");
      const { tenantId, from, to, types, courseId } = options;

      const localSessions = await prisma.tenantScheduleSession.findMany({
        where: {
          tenantId,
          ...(courseId !== undefined ? { courseId } : {}),
          startsAt: { lte: to },
          endsAt: { gte: from },
        },
      });

      for (const row of localSessions) {
        if (types && !types.includes(row.sessionType as any)) continue;

        studentSessions.push(
          new ScheduleSessionEntity(row.id, tenantId, {
            id: row.id,
            sessionType: row.sessionType as any,
            title: row.title,
            startsAt: row.startsAt.toISOString(),
            endsAt: row.endsAt.toISOString(),
            allDay: row.allDay,
            courseId: row.courseId,
            courseName: row.courseName || undefined,
            subjectCode: row.subjectCode || undefined,
            room: row.room || undefined,
            instructor: row.instructor || undefined,
            classGroup: row.classGroup || undefined,
            status: row.status as ScheduleSessionStatus,
            description: row.description || undefined,
            isPublished: row.isPublished,
            detailRoute: `${ROUTES.DASHBOARD.SCHEDULE}/${row.id}`,
          }),
        );
      }
    } catch (err) {
      console.warn(
        "[ScheduleRepo] Error querying teacher local sessions:",
        err,
      );
    }

    return studentSessions;
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

    // Try finding in local PostgreSQL database
    try {
      const { prisma } = await import("@/libs/prisma");
      const row = await prisma.tenantScheduleSession.findFirst({
        where: {
          id: sessionId,
          tenantId,
        },
      });

      if (!row) return null;

      return new ScheduleSessionEntity(row.id, tenantId, {
        id: row.id,
        sessionType: row.sessionType as any,
        title: row.title,
        startsAt: row.startsAt.toISOString(),
        endsAt: row.endsAt.toISOString(),
        allDay: row.allDay,
        courseId: row.courseId,
        courseName: row.courseName || undefined,
        subjectCode: row.subjectCode || undefined,
        room: row.room || undefined,
        instructor: row.instructor || undefined,
        classGroup: row.classGroup || undefined,
        status: row.status as ScheduleSessionStatus,
        description: row.description || undefined,
        isPublished: row.isPublished,
        detailRoute: `${ROUTES.DASHBOARD.SCHEDULE}/${row.id}`,
      });
    } catch (err) {
      console.warn("[ScheduleRepo] Error fetching session by id:", err);
      return null;
    }
  }

  async createSession(options: {
    tenantId: string;
    createdById?: string;
    data: {
      title: string;
      sessionType: any;
      courseId: number;
      courseName?: string;
      subjectCode?: string;
      startsAt: string;
      endsAt: string;
      room?: string;
      instructor?: string;
      classGroup?: string;
      description?: string;
    };
  }): Promise<ScheduleSessionEntity> {
    const { tenantId, createdById, data } = options;
    const { prisma } = await import("@/libs/prisma");

    const row = await prisma.tenantScheduleSession.create({
      data: {
        tenantId,
        createdById,
        title: data.title,
        sessionType: data.sessionType,
        courseId: data.courseId,
        courseName: data.courseName,
        subjectCode: data.subjectCode,
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
        room: data.room,
        instructor: data.instructor,
        classGroup: data.classGroup,
        description: data.description,
        status: "PUBLISHED",
        isPublished: true,
      },
    });

    return new ScheduleSessionEntity(row.id, tenantId, {
      id: row.id,
      sessionType: row.sessionType as any,
      title: row.title,
      startsAt: row.startsAt.toISOString(),
      endsAt: row.endsAt.toISOString(),
      allDay: row.allDay,
      courseId: row.courseId,
      courseName: row.courseName || undefined,
      subjectCode: row.subjectCode || undefined,
      room: row.room || undefined,
      instructor: row.instructor || undefined,
      classGroup: row.classGroup || undefined,
      status: row.status as ScheduleSessionStatus,
      description: row.description || undefined,
      isPublished: row.isPublished,
      detailRoute: `${ROUTES.DASHBOARD.SCHEDULE}/${row.id}`,
    });
  }

  async updateSession(options: {
    tenantId: string;
    sessionId: string;
    data: Partial<{
      title: string;
      room: string;
      instructor: string;
      startsAt: string;
      endsAt: string;
      description: string;
      status: ScheduleSessionStatus;
    }>;
  }): Promise<ScheduleSessionEntity | null> {
    const { tenantId, sessionId, data } = options;
    const { prisma } = await import("@/libs/prisma");

    const existing = await prisma.tenantScheduleSession.findFirst({
      where: { id: sessionId, tenantId },
    });
    if (!existing) return null;

    const row = await prisma.tenantScheduleSession.update({
      where: { id: sessionId },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.room !== undefined ? { room: data.room } : {}),
        ...(data.instructor !== undefined
          ? { instructor: data.instructor }
          : {}),
        ...(data.startsAt ? { startsAt: new Date(data.startsAt) } : {}),
        ...(data.endsAt ? { endsAt: new Date(data.endsAt) } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.status ? { status: data.status } : {}),
      },
    });

    return new ScheduleSessionEntity(row.id, tenantId, {
      id: row.id,
      sessionType: row.sessionType as any,
      title: row.title,
      startsAt: row.startsAt.toISOString(),
      endsAt: row.endsAt.toISOString(),
      allDay: row.allDay,
      courseId: row.courseId,
      courseName: row.courseName || undefined,
      subjectCode: row.subjectCode || undefined,
      room: row.room || undefined,
      instructor: row.instructor || undefined,
      classGroup: row.classGroup || undefined,
      status: row.status as ScheduleSessionStatus,
      description: row.description || undefined,
      isPublished: row.isPublished,
      detailRoute: `${ROUTES.DASHBOARD.SCHEDULE}/${row.id}`,
    });
  }

  async publishSession(options: {
    tenantId: string;
    sessionId: string;
  }): Promise<ScheduleSessionEntity | null> {
    const { tenantId, sessionId } = options;
    const { prisma } = await import("@/libs/prisma");

    const existing = await prisma.tenantScheduleSession.findFirst({
      where: { id: sessionId, tenantId },
    });
    if (!existing) return null;

    const row = await prisma.tenantScheduleSession.update({
      where: { id: sessionId },
      data: {
        isPublished: true,
        status: "PUBLISHED",
      },
    });

    return new ScheduleSessionEntity(row.id, tenantId, {
      id: row.id,
      sessionType: row.sessionType as any,
      title: row.title,
      startsAt: row.startsAt.toISOString(),
      endsAt: row.endsAt.toISOString(),
      allDay: row.allDay,
      courseId: row.courseId,
      courseName: row.courseName || undefined,
      subjectCode: row.subjectCode || undefined,
      room: row.room || undefined,
      instructor: row.instructor || undefined,
      classGroup: row.classGroup || undefined,
      status: row.status as ScheduleSessionStatus,
      description: row.description || undefined,
      isPublished: row.isPublished,
      detailRoute: `${ROUTES.DASHBOARD.SCHEDULE}/${row.id}`,
    });
  }

  async cancelSession(options: {
    tenantId: string;
    sessionId: string;
  }): Promise<ScheduleSessionEntity | null> {
    const { tenantId, sessionId } = options;
    const { prisma } = await import("@/libs/prisma");

    const existing = await prisma.tenantScheduleSession.findFirst({
      where: { id: sessionId, tenantId },
    });
    if (!existing) return null;

    const row = await prisma.tenantScheduleSession.update({
      where: { id: sessionId },
      data: {
        status: "CANCELLED",
      },
    });

    return new ScheduleSessionEntity(row.id, tenantId, {
      id: row.id,
      sessionType: row.sessionType as any,
      title: row.title,
      startsAt: row.startsAt.toISOString(),
      endsAt: row.endsAt.toISOString(),
      allDay: row.allDay,
      courseId: row.courseId,
      courseName: row.courseName || undefined,
      subjectCode: row.subjectCode || undefined,
      room: row.room || undefined,
      instructor: row.instructor || undefined,
      classGroup: row.classGroup || undefined,
      status: row.status as ScheduleSessionStatus,
      description: row.description || undefined,
      isPublished: row.isPublished,
      detailRoute: `${ROUTES.DASHBOARD.SCHEDULE}/${row.id}`,
    });
  }
}
