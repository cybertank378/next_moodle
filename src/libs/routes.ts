export const ROUTES = {
  HOME: "/",
  FORBIDDEN: "/403",
  AUTH: {
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    CHANGE_PASSWORD: "/change-password",
  },
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    TENANTS: "/admin/tenants",
    AUDIT: "/admin/audit",
    SETTINGS: "/admin/settings",
  },
  TENANT: {
    ROOT: "/tenant",
    DASHBOARD: "/tenant/dashboard",
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
    DASHBOARD: "/student/dashboard",
    COURSES: "/student/courses",
    EXAMS: "/student/exams",
    RESULTS: "/student/results",
  },
} as const;

export type AppRoutes = typeof ROUTES;
