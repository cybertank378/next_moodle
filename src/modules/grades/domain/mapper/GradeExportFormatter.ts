// File: src/modules/grades/domain/mapper/GradeExportFormatter.ts

import type { UserGradeReportResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";

function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  const str = String(value);
  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

function formatGradesToCsv(
  reports: UserGradeReportResponseDto[],
  _courseTitle?: string,
): string {
  const headers = [
    "No",
    "ID Peserta",
    "Nama Siswa",
    "Nilai Akhir",
    "Nilai Maksimum",
    "Persentase",
    "Status Kelulusan",
    "Catatan",
  ];

  const rows: string[] = [];
  rows.push(headers.join(","));

  reports.forEach((report, index) => {
    const total = report.courseTotal;
    const gradeFormatted =
      total?.gradeFormatted ||
      (total?.gradeRaw !== null && total?.gradeRaw !== undefined
        ? String(total.gradeRaw)
        : "-");
    const gradeMax =
      total?.gradeMax !== undefined ? String(total.gradeMax) : "100";
    const percentage = total?.percentageFormatted || "-";
    const status =
      total?.isPassed === true
        ? "LULUS"
        : total?.isPassed === false
          ? "BELUM LULUS"
          : "-";
    const feedback = total?.feedback || "-";

    const row = [
      escapeCsvField(index + 1),
      escapeCsvField(report.userId),
      escapeCsvField(report.userFullName),
      escapeCsvField(gradeFormatted),
      escapeCsvField(gradeMax),
      escapeCsvField(percentage),
      escapeCsvField(status),
      escapeCsvField(feedback),
    ];

    rows.push(row.join(","));
  });

  // Prepend UTF-8 BOM (\uFEFF) so Excel on Windows/Mac opens the CSV automatically as UTF-8
  return `\uFEFF${rows.join("\r\n")}\r\n`;
}

export const GradeExportFormatter = {
  formatGradesToCsv,
};
