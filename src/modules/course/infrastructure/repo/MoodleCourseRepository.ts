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
    if (!input.client) {
      throw new Error(
        "Moodle client wajib disertakan untuk mengambil course siswa.",
      );
    }
    const client = input.client;

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

    let rawCourses: RawMoodleCourse[] = [];
    try {
      rawCourses = await client.call<RawMoodleCourse[]>(
        "local_examapi_get_courses",
        {
          tenantkey: input.tenantId,
        },
      );
    } catch {
      try {
        // Fallback to core_course_get_courses for standard Moodle installations
        rawCourses = await client.call<RawMoodleCourse[]>(
          "core_course_get_courses",
          {},
        );
      } catch {
        // If caller was using a user token that lacks system-wide course permissions,
        // fallback to tenant admin client to retrieve tenant courses catalog
        if (input.client) {
          try {
            const tenantClient = await this.clientFactory.createClientForTenant(
              {
                tenantId: input.tenantId,
                tenantSlug: input.tenantId,
                status: "ACTIVE",
              },
              "admin",
            );
            try {
              rawCourses = await tenantClient.call<RawMoodleCourse[]>(
                "local_examapi_get_courses",
                { tenantkey: input.tenantId },
              );
            } catch {
              rawCourses = await tenantClient.call<RawMoodleCourse[]>(
                "core_course_get_courses",
                {},
              );
            }
          } catch {
            rawCourses = [];
          }
        } else {
          rawCourses = [];
        }
      }
    }

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

    try {
      const rawSections = await client.call<RawMoodleSection[]>(
        "core_course_get_contents",
        {
          courseid: input.courseId,
        },
      );

      return (rawSections ?? []).map(CourseMapper.toSectionDTO);
    } catch {
      if (input.client) {
        try {
          const adminClient = await this.clientFactory.createClientForTenant(
            {
              tenantId: input.tenantId,
              tenantSlug: input.tenantId,
              status: "ACTIVE",
            },
            "admin",
          );
          const rawSections = await adminClient.call<RawMoodleSection[]>(
            "core_course_get_contents",
            {
              courseid: input.courseId,
            },
          );
          return (rawSections ?? []).map(CourseMapper.toSectionDTO);
        } catch {
          return [];
        }
      }
      return [];
    }
  }

  async getCourseById(input: {
    tenantId: string;
    courseId: number;
    client?: MoodleClient;
  }): Promise<CourseEntity | null> {
    const client = await this.resolveClient(input.tenantId, input.client);

    try {
      const rawCourses = await client.call<RawMoodleCourse[]>(
        "core_course_get_courses",
        {
          options: {
            ids: [input.courseId],
          },
        },
      );

      const found = (rawCourses ?? []).find((c) => c.id === input.courseId);
      if (!found) return null;

      return CourseMapper.toEntity(found, input.tenantId);
    } catch {
      if (input.client) {
        try {
          const adminClient = await this.clientFactory.createClientForTenant(
            {
              tenantId: input.tenantId,
              tenantSlug: input.tenantId,
              status: "ACTIVE",
            },
            "admin",
          );
          const rawCourses = await adminClient.call<RawMoodleCourse[]>(
            "core_course_get_courses",
            {
              options: {
                ids: [input.courseId],
              },
            },
          );
          const found = (rawCourses ?? []).find((c) => c.id === input.courseId);
          if (found) return CourseMapper.toEntity(found, input.tenantId);
        } catch {
          return null;
        }
      }
      return null;
    }
  }
}
