import { describe, expect, it } from "vitest";
import {
  MoodleCourseMapper,
  type MoodleCourseRaw,
} from "@/modules/courses/infrastructure/mappers/MoodleCourseMapper";

describe("MoodleCourseMapper", () => {
  it("should map raw Moodle course JSON to domain Course entity", () => {
    const raw: MoodleCourseRaw = {
      id: 101,
      fullname: "Pengenalan Pemrograman Web",
      shortname: "WEB101",
      summary: "<p>Belajar HTML, CSS, dan Next.js</p>",
      category: 1,
      visible: 1,
      enrolledusercount: 45,
      startdate: 1700000000,
      enddate: 1710000000,
    };

    const course = MoodleCourseMapper.toDomain(raw, "tenant_demo");

    expect(course.id).toBe("crs_tenant_demo_101");
    expect(course.moodleCourseId).toBe(101);
    expect(course.fullName).toBe("Pengenalan Pemrograman Web");
    expect(course.shortName).toBe("WEB101");
    expect(course.summary).toBe("Belajar HTML, CSS, dan Next.js"); // HTML tags stripped
    expect(course.visibility).toBe("visible");
    expect(course.enrolledUserCount).toBe(45);
    expect(course.startDate).toEqual(new Date(1700000000 * 1000));
    expect(course.endDate).toEqual(new Date(1710000000 * 1000));
  });

  it("should handle hidden course correctly", () => {
    const raw: MoodleCourseRaw = {
      id: 102,
      fullname: "Draft Kursus",
      shortname: "DRAFT",
      visible: 0,
    };

    const course = MoodleCourseMapper.toDomain(raw, "tenant_demo");
    expect(course.visibility).toBe("hidden");
    expect(course.isVisible()).toBe(false);
  });
});
