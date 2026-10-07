const DASHBOARD_ROOT = "/dashboard";

export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    CHANGE_PASSWORD: "/change-password",
  },
  ADMIN: {
    ROOT: DASHBOARD_ROOT,
    TENANTS: `${DASHBOARD_ROOT}/tenants`,
    NOTIFICATIONS: `${DASHBOARD_ROOT}/notifications`,
    AUDIT: `${DASHBOARD_ROOT}/audit`,
    SETTINGS: `${DASHBOARD_ROOT}/settings`,
  },
  TENANT: {
    ROOT: DASHBOARD_ROOT,
    USERS: `${DASHBOARD_ROOT}/users`,
    ENROLMENTS: `${DASHBOARD_ROOT}/enrolments`,
    GROUPS: `${DASHBOARD_ROOT}/groups`,
    COURSES: `${DASHBOARD_ROOT}/courses`,
    QUESTIONS: `${DASHBOARD_ROOT}/questions`,
    EXAMS: `${DASHBOARD_ROOT}/exams`,
    RESULTS: `${DASHBOARD_ROOT}/results`,
    NOTIFICATIONS: `${DASHBOARD_ROOT}/notifications`,
    BRANDING: `${DASHBOARD_ROOT}/branding`,
    AUDIT: `${DASHBOARD_ROOT}/audit`,
    PROCTOR: `${DASHBOARD_ROOT}/proctor`,
  },
  STUDENT: {
    ROOT: DASHBOARD_ROOT,
    COURSES: `${DASHBOARD_ROOT}/courses`,
    EXAMS: `${DASHBOARD_ROOT}/exams`,
    RESULTS: `${DASHBOARD_ROOT}/results`,
  },
  TEACHER: {
    ROOT: DASHBOARD_ROOT,
    COURSES: `${DASHBOARD_ROOT}/courses`,
    QUESTIONS: `${DASHBOARD_ROOT}/questions`,
    EXAMS: `${DASHBOARD_ROOT}/exams`,
    RESULTS: `${DASHBOARD_ROOT}/results`,
  },
} as const;

export type AppRoutes = typeof ROUTES;

export const AppRouteConstants = {
  HOME: ROUTES.HOME,
  LOGIN: ROUTES.AUTH.LOGIN,
  REGISTER: ROUTES.AUTH.REGISTER,

  // Shared dashboard aliases used by feature UI.
  DASHBOARD: DASHBOARD_ROOT,
  COURSES: ROUTES.TENANT.COURSES,
  EXAMS: ROUTES.TENANT.EXAMS,
  USERS: ROUTES.TENANT.USERS,
  TENANTS: ROUTES.ADMIN.TENANTS,

  courseDetail(id: number | string): string {
    return `${ROUTES.TENANT.COURSES}/${id}`;
  },

  examDetail(id: number | string): string {
    return `${ROUTES.TENANT.EXAMS}/${id}`;
  },

  examAttempt(quizId: number | string, attemptId: number | string): string {
    return `${ROUTES.STUDENT.EXAMS}/${quizId}/attempt/${attemptId}`;
  },
} as const;
