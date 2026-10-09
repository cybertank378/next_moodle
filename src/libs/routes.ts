// Files: src/libs/routes.ts

const DASHBOARD_ROOT = "/dashboard";

export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    CHANGE_PASSWORD: "/change-password",
  },
  DASHBOARD: {
    ROOT: DASHBOARD_ROOT,
    AUDIT: `${DASHBOARD_ROOT}/audit`,
    BRANDING: `${DASHBOARD_ROOT}/branding`,
    SETTINGS: `${DASHBOARD_ROOT}/settings`,
    NOTIFICATIONS: `${DASHBOARD_ROOT}/notifications`,
    PROCTOR: `${DASHBOARD_ROOT}/proctor`,
    ASSIGNMENTS: `${DASHBOARD_ROOT}/assignments`,
    CALENDAR: `${DASHBOARD_ROOT}/calendar`,
    SCHEDULE: `${DASHBOARD_ROOT}/schedule`,
    ANNOUNCEMENTS: `${DASHBOARD_ROOT}/announcements`,
    ACTIVITIES: `${DASHBOARD_ROOT}/activities`,
    PROFILE: `${DASHBOARD_ROOT}/profile`,

    // Tenants
    TENANTS: `${DASHBOARD_ROOT}/tenants`,
    TENANTS_CREATE: `${DASHBOARD_ROOT}/tenants/create`,
    TENANT_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/tenants/${id}`,
    TENANT_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/tenants/${id}/edit`,

    // Users
    USERS: `${DASHBOARD_ROOT}/users`,
    USERS_CREATE: `${DASHBOARD_ROOT}/users/create`,
    USER_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/users/${id}`,
    USER_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/users/${id}/edit`,

    // Enrolments
    ENROLMENTS: `${DASHBOARD_ROOT}/enrolments`,
    ENROLMENTS_CREATE: `${DASHBOARD_ROOT}/enrolments/create`,
    ENROLMENT_DETAIL: (id: string | number) =>
      `${DASHBOARD_ROOT}/enrolments/${id}`,
    ENROLMENT_EDIT: (id: string | number) =>
      `${DASHBOARD_ROOT}/enrolments/${id}/edit`,

    // Groups
    GROUPS: `${DASHBOARD_ROOT}/groups`,
    GROUPS_CREATE: `${DASHBOARD_ROOT}/groups/create`,
    GROUP_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/groups/${id}`,
    GROUP_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/groups/${id}/edit`,

    // Courses
    COURSES: `${DASHBOARD_ROOT}/courses`,
    COURSE_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/courses/${id}`,

    // Questions
    QUESTIONS: `${DASHBOARD_ROOT}/questions`,
    QUESTIONS_CREATE: `${DASHBOARD_ROOT}/questions/create`,
    QUESTION_DETAIL: (id: string | number) =>
      `${DASHBOARD_ROOT}/questions/${id}`,
    QUESTION_EDIT: (id: string | number) =>
      `${DASHBOARD_ROOT}/questions/${id}/edit`,

    // Exams
    EXAMS: `${DASHBOARD_ROOT}/exams`,
    EXAMS_CREATE: `${DASHBOARD_ROOT}/exams/create`,
    EXAM_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/exams/${id}`,
    EXAM_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/exams/${id}/edit`,
    EXAM_MONITOR: (id: string | number) =>
      `${DASHBOARD_ROOT}/exams/${id}/monitor`,
    EXAM_ATTEMPT: (quizId: string | number, attemptId: string | number) =>
      `${DASHBOARD_ROOT}/exams/${quizId}/attempt/${attemptId}`,

    // Results
    RESULTS: `${DASHBOARD_ROOT}/results`,
    RESULT_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/results/${id}`,
  },

  // Role-scoped convenience aliases
  ADMIN: {
    ROOT: DASHBOARD_ROOT,
    TENANTS: `${DASHBOARD_ROOT}/tenants`,
    TENANTS_CREATE: `${DASHBOARD_ROOT}/tenants/create`,
    TENANT_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/tenants/${id}`,
    TENANT_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/tenants/${id}/edit`,
    NOTIFICATIONS: `${DASHBOARD_ROOT}/notifications`,
    AUDIT: `${DASHBOARD_ROOT}/audit`,
    SETTINGS: `${DASHBOARD_ROOT}/settings`,
    RESULTS: `${DASHBOARD_ROOT}/results`,
  },
  TENANT: {
    ROOT: DASHBOARD_ROOT,
    USERS: `${DASHBOARD_ROOT}/users`,
    USERS_CREATE: `${DASHBOARD_ROOT}/users/create`,
    USER_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/users/${id}`,
    USER_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/users/${id}/edit`,
    ENROLMENTS: `${DASHBOARD_ROOT}/enrolments`,
    ENROLMENTS_CREATE: `${DASHBOARD_ROOT}/enrolments/create`,
    ENROLMENT_DETAIL: (id: string | number) =>
      `${DASHBOARD_ROOT}/enrolments/${id}`,
    ENROLMENT_EDIT: (id: string | number) =>
      `${DASHBOARD_ROOT}/enrolments/${id}/edit`,
    GROUPS: `${DASHBOARD_ROOT}/groups`,
    GROUPS_CREATE: `${DASHBOARD_ROOT}/groups/create`,
    GROUP_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/groups/${id}`,
    GROUP_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/groups/${id}/edit`,
    COURSES: `${DASHBOARD_ROOT}/courses`,
    COURSE_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/courses/${id}`,
    QUESTIONS: `${DASHBOARD_ROOT}/questions`,
    QUESTIONS_CREATE: `${DASHBOARD_ROOT}/questions/create`,
    QUESTION_DETAIL: (id: string | number) =>
      `${DASHBOARD_ROOT}/questions/${id}`,
    QUESTION_EDIT: (id: string | number) =>
      `${DASHBOARD_ROOT}/questions/${id}/edit`,
    EXAMS: `${DASHBOARD_ROOT}/exams`,
    EXAMS_CREATE: `${DASHBOARD_ROOT}/exams/create`,
    EXAM_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/exams/${id}`,
    EXAM_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/exams/${id}/edit`,
    EXAM_MONITOR: (id: string | number) =>
      `${DASHBOARD_ROOT}/exams/${id}/monitor`,
    RESULTS: `${DASHBOARD_ROOT}/results`,
    RESULT_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/results/${id}`,
    NOTIFICATIONS: `${DASHBOARD_ROOT}/notifications`,
    BRANDING: `${DASHBOARD_ROOT}/branding`,
    AUDIT: `${DASHBOARD_ROOT}/audit`,
    PROCTOR: `${DASHBOARD_ROOT}/proctor`,
    SETTINGS: `${DASHBOARD_ROOT}/settings`,
  },
  STUDENT: {
    ROOT: DASHBOARD_ROOT,
    COURSES: `${DASHBOARD_ROOT}/courses`,
    COURSE_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/courses/${id}`,
    EXAMS: `${DASHBOARD_ROOT}/exams`,
    EXAM_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/exams/${id}`,
    EXAM_ATTEMPT: (quizId: string | number, attemptId: string | number) =>
      `${DASHBOARD_ROOT}/exams/${quizId}/attempt/${attemptId}`,
    RESULTS: `${DASHBOARD_ROOT}/results`,
    RESULT_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/results/${id}`,
    NOTIFICATIONS: `${DASHBOARD_ROOT}/notifications`,
    ASSIGNMENTS: `${DASHBOARD_ROOT}/assignments`,
    CALENDAR: `${DASHBOARD_ROOT}/calendar`,
    SCHEDULE: `${DASHBOARD_ROOT}/schedule`,
    ANNOUNCEMENTS: `${DASHBOARD_ROOT}/announcements`,
    ACTIVITIES: `${DASHBOARD_ROOT}/activities`,
    PROFILE: `${DASHBOARD_ROOT}/profile`,
    SETTINGS: `${DASHBOARD_ROOT}/settings`,
  },
  TEACHER: {
    ROOT: DASHBOARD_ROOT,
    COURSES: `${DASHBOARD_ROOT}/courses`,
    COURSE_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/courses/${id}`,
    QUESTIONS: `${DASHBOARD_ROOT}/questions`,
    QUESTIONS_CREATE: `${DASHBOARD_ROOT}/questions/create`,
    QUESTION_DETAIL: (id: string | number) =>
      `${DASHBOARD_ROOT}/questions/${id}`,
    QUESTION_EDIT: (id: string | number) =>
      `${DASHBOARD_ROOT}/questions/${id}/edit`,
    EXAMS: `${DASHBOARD_ROOT}/exams`,
    EXAM_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/exams/${id}`,
    EXAM_MONITOR: (id: string | number) =>
      `${DASHBOARD_ROOT}/exams/${id}/monitor`,
    RESULTS: `${DASHBOARD_ROOT}/results`,
    RESULT_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/results/${id}`,
    NOTIFICATIONS: `${DASHBOARD_ROOT}/notifications`,
    PROFILE: `${DASHBOARD_ROOT}/profile`,
    SETTINGS: `${DASHBOARD_ROOT}/settings`,
  },
} as const;

export type AppRoutes = typeof ROUTES;

/**
 * Backward-compatible bridge for AppRouteConstants.
 * Directs to the canonical ROUTES definition.
 */
export const AppRouteConstants = {
  HOME: ROUTES.HOME,
  LOGIN: ROUTES.AUTH.LOGIN,
  REGISTER: ROUTES.AUTH.REGISTER,

  // Shared dashboard aliases used by feature UI.
  DASHBOARD: ROUTES.DASHBOARD.ROOT,
  COURSES: ROUTES.DASHBOARD.COURSES,
  EXAMS: ROUTES.DASHBOARD.EXAMS,
  USERS: ROUTES.DASHBOARD.USERS,
  TENANTS: ROUTES.DASHBOARD.TENANTS,
  RESULTS: ROUTES.DASHBOARD.RESULTS,

  courseDetail: ROUTES.DASHBOARD.COURSE_DETAIL,
  examDetail: ROUTES.DASHBOARD.EXAM_DETAIL,
  examAttempt: ROUTES.DASHBOARD.EXAM_ATTEMPT,
} as const;
