import { describe, expect, it } from "vitest";
import type { UserGradeReportResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import { GradeExportFormatter } from "@/modules/grades/domain/mapper/GradeExportFormatter";

describe("GradeExportFormatter", () => {
  const mockReports: UserGradeReportResponseDto[] = [
    {
      courseId: 101,
      userId: 1,
      userFullName: "Budi Santoso",
      items: [],
      courseTotal: {
        id: 991,
        itemName: "Total Kursus",
        itemType: "course",
        itemModule: null,
        itemInstance: null,
        gradeRaw: 85.5,
        gradeFormatted: "85.50",
        gradeMin: 0,
        gradeMax: 100,
        gradePass: 75,
        percentageFormatted: "85.50%",
        feedback: "Sangat baik, pertahankan!",
        isPassed: true,
      },
    },
    {
      courseId: 101,
      userId: 2,
      userFullName: 'Siti "Aisyah", S.Pd',
      items: [],
      courseTotal: {
        id: 992,
        itemName: "Total Kursus",
        itemType: "course",
        itemModule: null,
        itemInstance: null,
        gradeRaw: 60.0,
        gradeFormatted: "60.00",
        gradeMin: 0,
        gradeMax: 100,
        gradePass: 75,
        percentageFormatted: "60.00%",
        feedback: "Perlu remedial",
        isPassed: false,
      },
    },
    {
      courseId: 101,
      userId: 3,
      userFullName: "Ahmad Dahlan",
      items: [],
      courseTotal: null,
    },
  ];

  it("generates Excel-compatible CSV starting with UTF-8 BOM", () => {
    const csv = GradeExportFormatter.formatGradesToCsv(
      mockReports,
      "Matematika Dasar",
    );
    expect(csv.startsWith("\uFEFF")).toBe(true);
  });

  it("includes correct headers and metadata in CSV output", () => {
    const csv = GradeExportFormatter.formatGradesToCsv(
      mockReports,
      "Matematika Dasar",
    );
    expect(csv).toContain(
      "No,ID Peserta,Nama Siswa,Nilai Akhir,Nilai Maksimum,Persentase,Status Kelulusan,Catatan",
    );
  });

  it("formats student records correctly with proper escaping for quotes and commas", () => {
    const csv = GradeExportFormatter.formatGradesToCsv(
      mockReports,
      "Matematika Dasar",
    );

    // Row 1: Budi Santoso
    expect(csv).toContain(
      '1,1,Budi Santoso,85.50,100,85.50%,LULUS,"Sangat baik, pertahankan!"',
    );

    // Row 2: Siti "Aisyah", S.Pd with escaped quotes and comma
    expect(csv).toContain('"Siti ""Aisyah"", S.Pd"');
    expect(csv).toContain("60.00,100,60.00%,BELUM LULUS,Perlu remedial");

    // Row 3: Ahmad Dahlan without courseTotal
    expect(csv).toContain("3,3,Ahmad Dahlan,-,100,-,-,-");
  });
});
