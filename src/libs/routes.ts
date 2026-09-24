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
