import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { Result } from "@/core/base/Result";
import type { GetScheduleSessionDetailUseCase } from "@/modules/schedule/application/usecases/GetScheduleSessionDetailUseCase";
import type { GetStudentScheduleUseCase } from "@/modules/schedule/application/usecases/GetStudentScheduleUseCase";
import type { GetTeacherSchedulesUseCase } from "@/modules/schedule/application/usecases/GetTeacherSchedulesUseCase";
import type { GetTenantSchedulesUseCase } from "@/modules/schedule/application/usecases/GetTenantSchedulesUseCase";
import type {
  CancelScheduleUseCase,
  CreateScheduleUseCase,
  PublishScheduleUseCase,
  UpdateScheduleUseCase,
} from "@/modules/schedule/application/usecases/MutateScheduleUseCases";
import { ScheduleController } from "@/modules/schedule/infrastructure/http/ScheduleController";

describe("ScheduleController", () => {
  let getStudentSchedule: GetStudentScheduleUseCase;
  let getScheduleSessionDetail: GetScheduleSessionDetailUseCase;
  let controller: ScheduleController;

  const mockActor: CurrentActor = {
    userId: "usr_student",
    username: "student1",
    role: "STUDENT",
    tenantId: "tenant_abc",
    moodleUserId: 10,
  };

  beforeEach(() => {
    getStudentSchedule = {
      execute: vi.fn(),
    } as unknown as GetStudentScheduleUseCase;

    getScheduleSessionDetail = {
      execute: vi.fn(),
    } as unknown as GetScheduleSessionDetailUseCase;

    controller = new ScheduleController(
      getStudentSchedule,
      { execute: vi.fn() } as unknown as GetTenantSchedulesUseCase,
      { execute: vi.fn() } as unknown as GetTeacherSchedulesUseCase,
      getScheduleSessionDetail,
      { execute: vi.fn() } as unknown as CreateScheduleUseCase,
      { execute: vi.fn() } as unknown as UpdateScheduleUseCase,
      { execute: vi.fn() } as unknown as PublishScheduleUseCase,
      { execute: vi.fn() } as unknown as CancelScheduleUseCase,
    );
  });

  it("handles getSchedule successfully", async () => {
    vi.mocked(getStudentSchedule.execute).mockResolvedValue(
      Result.ok({
        items: [],
        range: { from: "2026-10-01", to: "2026-10-31" },
        meta: { total: 0, supportedTypes: ["EXAM"] },
      }),
    );

    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          from: "2026-10-01",
          to: "2026-10-31",
        }),
      },
    } as unknown as NextRequest;

    const res = await controller.getSchedule(mockActor, req, "token");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.range.from).toBe("2026-10-01");
  });

  it("returns 400 if validation fails", async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams(),
      },
    } as unknown as NextRequest;

    const res = await controller.getSchedule(mockActor, req, "token");
    expect(res.status).toBe(400);
  });
});
