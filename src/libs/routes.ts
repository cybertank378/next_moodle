export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    CHANGE_PASSWORD: "/change-password",
  },
  ADMIN: {
    ROOT: "/admin",
    TENANTS: "/admin/tenants",
    AUDIT: "/admin/audit",
    SETTINGS: "/admin/settings",
  },
  TENANT: {
    ROOT: "/tenant",
    USERS: "/tenant/users",
    ENROLMENTS: "/tenant/enrolments",
    GROUPS: "/tenant/groups",
    COURSES: "/tenant/courses",
    QUESTIONS: "/tenant/questions",
    EXAMS: "/tenant/exams",
    RESULTS: "/tenant/results",
    BRANDING: "/tenant/branding",
    AUDIT: "/tenant/audit",
  },
  STUDENT: {
    ROOT: "/student",
    COURSES: "/student/courses",
    EXAMS: "/student/exams",
    RESULTS: "/student/results",
  },
  TEACHER: {
    ROOT: "/teacher",
    COURSES: "/teacher/courses",
    QUESTIONS: "/teacher/questions",
    EXAMS: "/teacher/exams",
    RESULTS: "/teacher/results",
  },
} as const;

export type AppRoutes = typeof ROUTES;

export class AppRouteConstants {
  static readonly HOME = ROUTES.HOME;
  static readonly LOGIN = ROUTES.AUTH.LOGIN;
  static readonly REGISTER = ROUTES.AUTH.REGISTER;

  // Aliases to avoid breaking existing UI components (defaulting to tenant paths where applicable)
  static readonly DASHBOARD = ROUTES.TENANT.ROOT;
  static readonly COURSES = ROUTES.TENANT.COURSES;
  static readonly EXAMS = ROUTES.TENANT.EXAMS;
  static readonly USERS = ROUTES.TENANT.USERS;
  static readonly TENANTS = ROUTES.ADMIN.TENANTS;

  static courseDetail(id: number | string): string {
    return `${ROUTES.TENANT.COURSES}/${id}`;
  }

  static examDetail(id: number | string): string {
    return `${ROUTES.TENANT.EXAMS}/${id}`;
  }

  static examAttempt(
    quizId: number | string,
    attemptId: number | string,
  ): string {
    return `${ROUTES.STUDENT.EXAMS}/${quizId}/attempt/${attemptId}`;
  }
}
