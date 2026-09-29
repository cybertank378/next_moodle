export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    CHANGE_PASSWORD: "/change-password",
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    TENANTS: "/dashboard/tenants",
    USERS: "/dashboard/users",
    ENROLMENTS: "/dashboard/enrolments",
    GROUPS: "/dashboard/groups",
    COURSES: "/dashboard/courses",
    QUESTIONS: "/dashboard/questions",
    EXAMS: "/dashboard/exams",
    RESULTS: "/dashboard/results",
    BRANDING: "/dashboard/branding",
    AUDIT: "/dashboard/audit",
    SETTINGS: "/dashboard/settings",
  },
} as const;

export type AppRoutes = typeof ROUTES;

export class AppRouteConstants {
  static readonly HOME = ROUTES.HOME;
  static readonly LOGIN = ROUTES.AUTH.LOGIN;
  static readonly REGISTER = ROUTES.AUTH.REGISTER;
  static readonly DASHBOARD = ROUTES.DASHBOARD.ROOT;
  static readonly COURSES = ROUTES.DASHBOARD.COURSES;
  static readonly EXAMS = ROUTES.DASHBOARD.EXAMS;
  static readonly USERS = ROUTES.DASHBOARD.USERS;
  static readonly TENANTS = ROUTES.DASHBOARD.TENANTS;

  static courseDetail(id: number | string): string {
    return `${ROUTES.DASHBOARD.COURSES}/${id}`;
  }

  static examDetail(id: number | string): string {
    return `${ROUTES.DASHBOARD.EXAMS}/${id}`;
  }

  static examAttempt(
    quizId: number | string,
    attemptId: number | string,
  ): string {
    return `${ROUTES.DASHBOARD.EXAMS}/${quizId}/attempt/${attemptId}`;
  }
}
