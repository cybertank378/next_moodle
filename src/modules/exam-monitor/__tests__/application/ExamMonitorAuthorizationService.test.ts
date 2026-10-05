import { describe, expect, it, vi } from "vitest";
import { authorizeExamMonitorOperation } from "@/modules/exam-monitor/application/services/ExamMonitorAuthorizationService";
import { AppRole } from "@/core/rbac/AppRole";
import { ForbiddenError } from "@/core/errors/ForbiddenError";

describe("ExamMonitorAuthorizationService", () => {
  it("allows PROCTOR to perform action if tenantId matches", () => {
    const actor = {
      userId: "proctor-1",
      username: "proctor",
      role: AppRole.TENANT,
      permissions: ["exam.monitor.action", "exam.monitor.read"],
      tenantId: "tenant-a",
    };
    
    // This will throw if forbidden
    expect(() => authorizeExamMonitorOperation(actor, "tenant-a", "action")).not.toThrow();
  });

  it("throws ForbiddenError if PROCTOR attempts to monitor a different tenant", () => {
    const actor = {
      userId: "proctor-1",
      username: "proctor",
      role: AppRole.TENANT,
      permissions: ["exam.monitor.action", "exam.monitor.read"],
      tenantId: "tenant-a",
    };
    
    expect(() => authorizeExamMonitorOperation(actor, "tenant-b", "action")).toThrow(ForbiddenError);
  });

  it("throws ForbiddenError if actor lacks EXAM_MONITOR_ACTION permission for action", () => {
    const actor = {
      userId: "admin-1",
      username: "admin",
      role: AppRole.STUDENT,
      permissions: ["exam.monitor.read"], // missing action
      tenantId: "tenant-a",
    };
    
    expect(() => authorizeExamMonitorOperation(actor, "tenant-a", "action")).toThrowError(
      "Anda tidak memiliki izin untuk melakukan aksi pengawasan ujian ini."
    );
  });

  it("allows actor with only EXAM_MONITOR_READ to perform read", () => {
    const actor = {
      userId: "viewer",
      username: "viewer",
      role: AppRole.TENANT,
      permissions: ["exam.monitor.read"],
      tenantId: "tenant-a",
    };
    
    expect(() => authorizeExamMonitorOperation(actor, "tenant-a", "read")).not.toThrow();
  });
});
