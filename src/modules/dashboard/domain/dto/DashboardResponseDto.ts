import type { TenantStatusType } from "@/libs/enums";
import type {
  TenantGrowthPoint,
  TenantStatusSummary,
} from "@/modules/dashboard/domain/types/DashboardTypes";

export interface RecentTenantResponseDto {
  id: string;
  name: string;
  slug: string;
  status: TenantStatusType;
  /** ISO-8601 timestamp. */
  createdAt: string;
}

export interface AdminDashboardResponseDto {
  summary: TenantStatusSummary;
  growth: TenantGrowthPoint[];
  recentTenants: RecentTenantResponseDto[];
}

export interface ExamSummaryDto {
  id: string;
  name: string;
  course: string;
  scheduledDate: string;
  duration: number;
  status: "open" | "upcoming" | "published" | "pending";
  enrolledCount?: number;
}

export interface CourseSummaryDto {
  id: string;
  name: string;
  shortName: string;
  instructor?: string;
  progress?: number;
}

export interface StudentProfileDto {
  name: string;
  educationLevel: "SD" | "SMP" | "SMA" | "SMK";
  schoolName: string;
  className: string;
  academicYear: string;
}

export interface StudentDashboardResponseDto {
  profile?: StudentProfileDto;
  upcomingExams: ExamSummaryDto[];
  courses?: CourseSummaryDto[];
}

export interface TeacherDashboardResponseDto {
  activeClasses: number;
  totalQuestions: number;
  upcomingExamsCount: number;
  totalStudents?: number;
  recentExams: ExamSummaryDto[];
  courses?: CourseSummaryDto[];
}

export interface TenantDashboardResponseDto {
  activeExams: number;
  questionsInBank: number;
  registeredUsers: number;
  averageScore: number;
  upcomingExams: ExamSummaryDto[];
}

export interface MonitorSessionDto {
  id: string;
  examName: string;
  startTime: string;
  duration: number;
  activeCandidates: number;
  totalCandidates: number;
  flags: number;
}

export interface ProctorDashboardResponseDto {
  liveExams: number;
  activeCandidates: number;
  incidentFlags: number;
  sessions: MonitorSessionDto[];
}
