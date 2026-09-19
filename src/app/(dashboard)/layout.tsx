import {
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
  User,
} from "lucide-react";
import Link from "next/link";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-6">
            <Link
              href="/courses"
              className="flex items-center space-x-2 font-bold text-lg text-primary"
            >
              <GraduationCap className="h-6 w-6" />
              <span>ExamCloud</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
              <Link
                href="/courses"
                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-secondary text-secondary-foreground"
              >
                <BookOpen className="h-4 w-4" />
                <span>Kursus</span>
              </Link>
              <Link
                href="/exams"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Ujian</span>
              </Link>
              <Link
                href="/results"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Hasil</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              <span>Tenant: DEMO</span>
            </div>
            <div className="flex items-center space-x-2 border-l pl-4 border-border">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-sm">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden lg:block text-xs text-left">
                <p className="font-semibold text-foreground">Demo Student</p>
                <p className="text-muted-foreground">student1@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground bg-card/40">
        <div className="container mx-auto px-4">
          Moodle Exam SaaS &copy; 2026. Hexagonal Architecture with Next.js &
          Moodle LMS.
        </div>
      </footer>
    </div>
  );
}
