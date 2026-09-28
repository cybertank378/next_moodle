import { describe, expect, it } from "vitest";
import { CourseMapper } from "@/modules/course/domain/mapper/CourseMapper";
import type {
  RawMoodleCourse,
  RawMoodleSection,
} from "@/modules/course/domain/types/CourseTypes";

describe("CourseMapper (RED -> GREEN)", () => {
  it("maps RawMoodleCourse response to CourseEntity and CourseSummaryResponseDTO", () => {
    const rawMoodleCourse: RawMoodleCourse = {
      id: 101,
      shortname: "MAT-XII",
      fullname: "Matematika Peminatan Kelas XII",
      displayname: "Matematika XII (2026)",
      idnumber: "KUR-MAT-12",
      summary: "<p>Modul pelajaran matematika peminatan semester ganjil.</p>",
      summaryformat: 1,
      format: "topics",
      startdate: 1757894400,
      enddate: 1773532800,
      category: 3,
      progress: 75.5,
      completed: false,
      overviewfiles: [
        {
          filename: "cover.jpg",
          fileurl:
            "https://moodle.test/pluginfile.php/1/course/overview/cover.jpg",
          mimetype: "image/jpeg",
        },
      ],
    };

    const entity = CourseMapper.toEntity(rawMoodleCourse, "tenant-alpha");

    expect(entity.id).toBe(101);
    expect(entity.tenantId).toBe("tenant-alpha");
    expect(entity.shortName).toBe("MAT-XII");
    expect(entity.fullName).toBe("Matematika Peminatan Kelas XII");
    expect(entity.displayName).toBe("Matematika XII (2026)");
    expect(entity.idNumber).toBe("KUR-MAT-12");
    expect(entity.summary).toBe(
      "<p>Modul pelajaran matematika peminatan semester ganjil.</p>",
    );
    expect(entity.format).toBe("topics");
    expect(entity.startDate).toBe(1757894400);
    expect(entity.endDate).toBe(1773532800);
    expect(entity.categoryId).toBe(3);
    expect(entity.progress).toBe(75.5);
    expect(entity.isCompleted).toBe(false);
    expect(entity.imageUrl).toBe(
      "https://moodle.test/pluginfile.php/1/course/overview/cover.jpg",
    );

    const dto = CourseMapper.toSummaryDTO(entity);
    expect(dto).toEqual({
      id: 101,
      shortName: "MAT-XII",
      fullName: "Matematika Peminatan Kelas XII",
      displayName: "Matematika XII (2026)",
      idNumber: "KUR-MAT-12",
      summary: "<p>Modul pelajaran matematika peminatan semester ganjil.</p>",
      format: "topics",
      startDate: 1757894400,
      endDate: 1773532800,
      categoryId: 3,
      progress: 75.5,
      isCompleted: false,
      imageUrl:
        "https://moodle.test/pluginfile.php/1/course/overview/cover.jpg",
    });
  });

  it("handles fallback values for optional or null properties", () => {
    const rawCourseMinimal: RawMoodleCourse = {
      id: 202,
      shortname: "BIN-X",
      fullname: "Bahasa Indonesia X",
    };

    const entity = CourseMapper.toEntity(rawCourseMinimal, "tenant-beta");
    const dto = CourseMapper.toSummaryDTO(entity);

    expect(entity.displayName).toBe("Bahasa Indonesia X");
    expect(entity.summary).toBe("");
    expect(entity.format).toBe("topics");
    expect(entity.idNumber).toBeNull();
    expect(entity.progress).toBeNull();
    expect(entity.isCompleted).toBe(false);
    expect(entity.imageUrl).toBeNull();
    expect(dto.imageUrl).toBeNull();
  });

  it("maps RawMoodleSection and modules to CourseSectionResponseDTO", () => {
    const rawSection: RawMoodleSection = {
      id: 55,
      name: "Bab 1: Kalkulus Dasar",
      summary: "Pengantar turunan dan integral",
      section: 1,
      visible: 1,
      modules: [
        {
          id: 501,
          name: "Kuis Latihan Limit",
          modname: "quiz",
          instance: 12,
          visible: 1,
          uservisible: true,
          completion: 1,
        },
        {
          id: 502,
          name: "Materi PDF Turunan",
          modname: "resource",
          url: "https://moodle.test/mod/resource/view.php?id=502",
          visible: 1,
          uservisible: true,
          completion: 0,
        },
      ],
    };

    const sectionDto = CourseMapper.toSectionDTO(rawSection);

    expect(sectionDto.id).toBe(55);
    expect(sectionDto.name).toBe("Bab 1: Kalkulus Dasar");
    expect(sectionDto.sectionNumber).toBe(1);
    expect(sectionDto.isVisible).toBe(true);
    expect(sectionDto.modules).toHaveLength(2);

    expect(sectionDto.modules[0]).toEqual({
      id: 501,
      name: "Kuis Latihan Limit",
      instanceId: 12,
      modName: "quiz",
      url: null,
      isVisible: true,
      completionStatus: 1,
    });

    expect(sectionDto.modules[1]).toEqual({
      id: 502,
      name: "Materi PDF Turunan",
      instanceId: null,
      modName: "resource",
      url: "https://moodle.test/mod/resource/view.php?id=502",
      isVisible: true,
      completionStatus: 0,
    });
  });
});
