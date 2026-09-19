import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CourseResponseDTO } from "@/modules/courses/domain/dto/CourseResponseDTO";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import React from "react";
import { CourseStatusBadge } from "../atoms/CourseStatusBadge";

export interface CourseCardProps {
  readonly course: CourseResponseDTO;
  readonly onSelectCourse?: (courseId: string) => void;
}

export function CourseCard({ course, onSelectCourse }: CourseCardProps) {
  return (
    <Card className="h-full flex flex-col justify-between hover:shadow-md transition-all duration-200 border-border/70 hover:border-primary/40 group">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wide">
            {course.shortName}
          </span>
          <CourseStatusBadge visibility={course.visibility} />
        </div>
        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
          {course.fullName}
        </CardTitle>
        <CardDescription className="line-clamp-2 min-h-[2.5rem]">
          {course.summary || "Tidak ada deskripsi kursus yang tersedia."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Users className="h-3.5 w-3.5" />
            <span>{course.enrolledUserCount} Siswa</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Moodle ID #{course.moodleCourseId}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/50">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between group/btn hover:bg-primary hover:text-primary-foreground transition-all"
          onClick={() => onSelectCourse?.(course.id)}
        >
          <span>Buka Kursus</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
