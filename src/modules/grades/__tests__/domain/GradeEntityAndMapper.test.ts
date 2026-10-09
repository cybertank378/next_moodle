import { describe, expect, it } from "vitest";
import {
  GradeItemEntity,
  UserGradeReportEntity,
} from "@/modules/grades/domain/entity/GradeItemEntity";
import { GradeMapper } from "@/modules/grades/domain/mapper/GradeMapper";
import type {
  RawMoodleCoreGradesResponse,
  RawMoodleUserGrade,
} from "@/modules/grades/domain/types/GradeTypes";

describe("GradeItemEntity", () => {
  it("should calculate isPassed correctly based on gradeRaw and gradePass", () => {
    const passedItem = new GradeItemEntity({
      id: 1,
      itemName: "Quiz 1",
      itemType: "mod",
      itemModule: "quiz",
      itemInstance: 10,
      gradeRaw: 80,
      gradeFormatted: "80.00",
      gradeMin: 0,
      gradeMax: 100,
      gradePass: 75,
      percentageFormatted: "80%",
      feedback: null,
    });

    expect(passedItem.isPassed).toBe(true);

    const failedItem = new GradeItemEntity({
      id: 2,
      itemName: "Quiz 2",
      itemType: "mod",
      itemModule: "quiz",
      itemInstance: 11,
      gradeRaw: 60,
      gradeFormatted: "60.00",
      gradeMin: 0,
      gradeMax: 100,
      gradePass: 75,
      percentageFormatted: "60%",
      feedback: null,
    });

    expect(failedItem.isPassed).toBe(false);

    const unassessedItem = new GradeItemEntity({
      id: 3,
      itemName: "Quiz 3",
      itemType: "mod",
      itemModule: "quiz",
      itemInstance: 12,
      gradeRaw: null,
      gradeFormatted: "-",
      gradeMin: 0,
      gradeMax: 100,
      gradePass: 75,
      percentageFormatted: null,
      feedback: null,
    });

    expect(unassessedItem.isPassed).toBeNull();
  });

  it("should identify course total item type", () => {
    const courseTotal = new GradeItemEntity({
      id: 99,
      itemName: "Course total",
      itemType: "course",
      itemModule: null,
      itemInstance: null,
      gradeRaw: 90,
      gradeFormatted: "90.00",
      gradeMin: 0,
      gradeMax: 100,
      gradePass: 70,
      percentageFormatted: "90%",
      feedback: "Great job",
    });

    expect(courseTotal.isCourseTotal()).toBe(true);
  });
});

describe("UserGradeReportEntity", () => {
  it("should summarize passed and total assessed items", () => {
    const item1 = new GradeItemEntity({
      id: 1,
      itemName: "Exam 1",
      itemType: "mod",
      itemModule: "quiz",
      itemInstance: 1,
      gradeRaw: 85,
      gradeFormatted: "85.00",
      gradeMin: 0,
      gradeMax: 100,
      gradePass: 70,
      percentageFormatted: "85%",
      feedback: null,
    });

    const item2 = new GradeItemEntity({
      id: 2,
      itemName: "Exam 2",
      itemType: "mod",
      itemModule: "quiz",
      itemInstance: 2,
      gradeRaw: 55,
      gradeFormatted: "55.00",
      gradeMin: 0,
      gradeMax: 100,
      gradePass: 70,
      percentageFormatted: "55%",
      feedback: null,
    });

    const report = new UserGradeReportEntity({
      courseId: 10,
      userId: 101,
      userFullName: "Alice",
      items: [item1, item2],
      courseTotal: null,
    });

    expect(report.passedItemsCount).toBe(1);
    expect(report.totalAssessedItems).toBe(2);
  });
});

describe("GradeMapper", () => {
  it("should map raw Moodle grade report to UserGradeReportEntity and DTO", () => {
    const rawUserGrade: RawMoodleUserGrade = {
      courseid: 5,
      userid: 202,
      userfullname: "Bob Student",
      gradeitems: [
        {
          id: 10,
          itemname: "Quiz Final",
          itemtype: "mod",
          itemmodule: "quiz",
          iteminstance: 3,
          graderaw: 92.5,
          gradeformatted: "92.50",
          grademin: 0,
          grademax: 100,
          gradepass: 75,
          percentageformatted: "92.5%",
          feedback: "Sangat baik",
        },
        {
          id: 11,
          itemname: "Course total",
          itemtype: "course",
          graderaw: 92.5,
          gradeformatted: "92.50",
          grademin: 0,
          grademax: 100,
          gradepass: 75,
          percentageformatted: "92.5%",
        },
      ],
    };

    const entity = GradeMapper.toUserReportEntity(rawUserGrade);
    expect(entity.courseId).toBe(5);
    expect(entity.userId).toBe(202);
    expect(entity.userFullName).toBe("Bob Student");
    expect(entity.items).toHaveLength(1);
    expect(entity.courseTotal?.itemName).toBe("Course total");

    const dto = GradeMapper.toUserReportDto(entity);
    expect(dto.courseId).toBe(5);
    expect(dto.userId).toBe(202);
    expect(dto.items[0].itemName).toBe("Quiz Final");
    expect(dto.items[0].isPassed).toBe(true);
    expect(dto.courseTotal?.gradeFormatted).toBe("92.50");
  });

  it("should map raw Moodle core grades response to report entities", () => {
    const rawCoreGrades: RawMoodleCoreGradesResponse = {
      items: [
        {
          activityid: 15,
          name: "Ulangan Harian 1",
          grades: [
            {
              id: 1,
              userid: 101,
              grade: 80,
              str_grade: "80.00",
              feedback: "Bagus",
            },
            {
              id: 2,
              userid: 102,
              grade: 95,
              str_grade: "95.00",
              feedback: "Sempurna",
            },
          ],
        },
      ],
    };

    const reports = GradeMapper.fromCoreGradesToReportEntities(
      20,
      rawCoreGrades,
    );
    expect(reports).toHaveLength(2);
    const student101 = reports.find((r) => r.userId === 101);
    expect(student101).toBeDefined();
    expect(student101?.items[0].itemName).toBe("Ulangan Harian 1");
    expect(student101?.items[0].gradeRaw).toBe(80);
  });
});
