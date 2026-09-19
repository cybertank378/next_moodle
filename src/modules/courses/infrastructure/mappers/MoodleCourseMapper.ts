import { Course } from "../../domain/entities/Course";

export interface MoodleCourseRaw {
  readonly id: number;
  readonly fullname: string;
  readonly shortname: string;
  readonly summary?: string;
  readonly category?: number;
  readonly visible?: number;
  readonly enrolledusercount?: number;
  readonly startdate?: number;
  readonly enddate?: number;
}

export const MoodleCourseMapper = {
  toDomain(raw: MoodleCourseRaw, tenantId: string): Course {
    return new Course({
      id: `crs_${tenantId}_${raw.id}`,
      moodleCourseId: raw.id,
      fullName: raw.fullname,
      shortName: raw.shortname,
      summary: raw.summary ? raw.summary.replace(/<[^>]*>?/gm, "").trim() : "",
      categoryId: raw.category,
      visibility: raw.visible === 0 ? "hidden" : "visible",
      enrolledUserCount: raw.enrolledusercount,
      startDate:
        raw.startdate && raw.startdate > 0
          ? new Date(raw.startdate * 1000)
          : undefined,
      endDate:
        raw.enddate && raw.enddate > 0
          ? new Date(raw.enddate * 1000)
          : undefined,
    });
  },

  toDomainList(
    rawList: readonly MoodleCourseRaw[],
    tenantId: string,
  ): readonly Course[] {
    return rawList.map((item) => MoodleCourseMapper.toDomain(item, tenantId));
  },
};
