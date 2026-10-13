import { describe, expect, it } from "vitest";
import { escapeCsvCell } from "@/modules/audit/presentation/helpers/auditCsv";
describe("CSV", () => {
  it("guards spreadsheet formulas", () => {
    expect(escapeCsvCell("=1+1")).toBe('"\'=1+1"');
    expect(escapeCsvCell("  =1+1")).toBe('"\'  =1+1"');
  });
  it("escapes quotes", () => {
    expect(escapeCsvCell('A"B')).toBe('"A""B"');
  });
});
