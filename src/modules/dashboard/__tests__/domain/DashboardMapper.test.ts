import { describe, expect, it } from "vitest";
import { DashboardMapper } from "@/modules/dashboard/domain/mapper/DashboardMapper";
import { TenantStatus } from "@/libs/enums";

describe("DashboardMapper.buildMonthlyGrowth", () => {
  const now = new Date("2026-10-15T08:00:00Z");

  it("menghasilkan N bucket bulan berurutan dengan bulan berjalan sebagai bucket terakhir", () => {
    const series = DashboardMapper.buildMonthlyGrowth({
      createdDates: [],
      baselineCount: 0,
      months: 3,
      now,
    });

    expect(series.map((p) => p.period)).toEqual([
      "2026-08",
      "2026-09",
      "2026-10",
    ]);
  });

  it("menghitung tenant baru per bulan dan total kumulatif dari baseline", () => {
    const series = DashboardMapper.buildMonthlyGrowth({
      createdDates: [
        new Date("2026-08-02T00:00:00Z"),
        new Date("2026-10-01T00:00:00Z"),
        new Date("2026-10-09T00:00:00Z"),
      ],
      baselineCount: 10,
      months: 3,
      now,
    });

    expect(series).toEqual([
      { period: "2026-08", newTenants: 1, cumulativeTenants: 11 },
      { period: "2026-09", newTenants: 0, cumulativeTenants: 11 },
      { period: "2026-10", newTenants: 2, cumulativeTenants: 13 },
    ]);
  });

  it("mengabaikan tanggal di luar rentang bucket", () => {
    const series = DashboardMapper.buildMonthlyGrowth({
      createdDates: [new Date("2025-01-01T00:00:00Z")],
      baselineCount: 0,
      months: 2,
      now,
    });

    expect(series.every((p) => p.newTenants === 0)).toBe(true);
  });
});

describe("DashboardMapper.toStatusSummary", () => {
  it("mengisi status yang tidak ada dengan nol dan menghitung total", () => {
    const summary = DashboardMapper.toStatusSummary([
      { status: TenantStatus.ACTIVE, count: 7 },
      { status: TenantStatus.SUSPENDED, count: 2 },
    ]);

    expect(summary).toEqual({
      total: 9,
      active: 7,
      maintenance: 0,
      suspended: 2,
    });
  });
});
