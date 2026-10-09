import "server-only";

import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import type { CourseSectionResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import type { CourseEntity } from "@/modules/course/domain/entity/CourseEntity";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import { CourseMapper } from "@/modules/course/domain/mapper/CourseMapper";
import type {
  RawMoodleCourse,
  RawMoodleSection,
} from "@/modules/course/domain/types/CourseTypes";

export class MoodleCourseRepository implements CourseRepositoryInterface {
  constructor(private readonly clientFactory: MoodleClientFactory) {}

  private async resolveClient(
    tenantId: string,
    clientOverride?: MoodleClient,
  ): Promise<MoodleClient> {
    if (clientOverride) return clientOverride;
    return this.clientFactory.createClientForTenant(
      { tenantId, tenantSlug: tenantId, status: "ACTIVE" },
      "admin",
    );
  }

  async getUserCourses(input: {
    tenantId: string;
    moodleUserId: number;
    client?: MoodleClient;
  }): Promise<CourseEntity[]> {
    const client = await this.resolveClient(input.tenantId, input.client);

    const rawCourses = await client.call<RawMoodleCourse[]>(
      "core_enrol_get_users_courses",
      {
        userid: input.moodleUserId,
      },
    );

    return (rawCourses ?? []).map((raw) =>
      CourseMapper.toEntity(raw, input.tenantId),
    );
  }

  async getTenantCourses(input: {
    tenantId: string;
    search?: string;
    client?: MoodleClient;
  }): Promise<CourseEntity[]> {
    const client = await this.resolveClient(input.tenantId, input.client);

    const rawCourses = await client.call<RawMoodleCourse[]>(
      "core_course_get_courses",
      {},
    );

    let courses = (rawCourses ?? [])
      // Filter out site course (id === 1 in Moodle is frontpage/site course)
      .filter((c) => c.id !== 1)
      .map((raw) => CourseMapper.toEntity(raw, input.tenantId));

    if (input.search?.trim()) {
      const q = input.search.toLowerCase().trim();
      courses = courses.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q),
      );
    }

    return courses;
  }

  async getCourseContents(input: {
    tenantId: string;
    courseId: number;
    client?: MoodleClient;
  }): Promise<CourseSectionResponseDTO[]> {
    const client = await this.resolveClient(input.tenantId, input.client);

    const rawSections = await client.call<RawMoodleSection[]>(
      "core_course_get_contents",
      {
        courseid: input.courseId,
      },
    );

    return (rawSections ?? []).map(CourseMapper.toSectionDTO);
  }
}
