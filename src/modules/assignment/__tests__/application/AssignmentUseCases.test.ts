import { describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import {
  GetStudentAssignmentsUseCase,
  SubmitAssignmentUseCase,
} from "@/modules/assignment/application/usecases/AssignmentUseCases";
import { AssignmentEntity } from "@/modules/assignment/domain/entity/AssignmentEntity";

describe("Assignment Use Cases (Issue #172)", () => {
  const mockAssignmentRepo: any = {
    getStudentAssignments: vi.fn(),
    getAssignmentById: vi.fn(),
  };

  const mockClientFactory: any = {
    createStudentClient: vi.fn().mockReturnValue({}),
  };

  describe("GetStudentAssignmentsUseCase", () => {
    it("denies access if actor is not STUDENT", async () => {
      const useCase = new GetStudentAssignmentsUseCase(
        mockAssignmentRepo,
        mockClientFactory,
      );

      const result = await useCase.execute({
        actor: {
          id: "tenant-user",
          role: AppRole.TENANT,
          tenantId: "tenant-1",
          moodleUserId: 5,
        },
        moodleToken: "valid-token",
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain("Hanya siswa");
    });

    it("requires moodleToken for student operations", async () => {
      const useCase = new GetStudentAssignmentsUseCase(
        mockAssignmentRepo,
        mockClientFactory,
      );

      const result = await useCase.execute({
        actor: {
          id: "student-user",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
          moodleUserId: 10,
        },
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain("Token Moodle");
    });

    it("returns truthful backend-contract-blocked response when mod_assign is unexposed", async () => {
      mockAssignmentRepo.getStudentAssignments.mockResolvedValue({
        items: [],
        backendBlocked: true,
        backendBlockedReason: "mod_assign not registered",
      });

      const useCase = new GetStudentAssignmentsUseCase(
        mockAssignmentRepo,
        mockClientFactory,
      );

      const result = await useCase.execute({
        actor: {
          id: "student-user",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
          moodleUserId: 10,
        },
        moodleToken: "valid-token",
      });

      expect(result.isSuccess).toBe(true);
      const val = result.getValue();
      expect(val.items).toEqual([]);
      expect(val.meta.backendBlocked).toBe(true);
    });

    it("maps items correctly when assignments are returned", async () => {
      const mockEntity = new AssignmentEntity("assign-1", "tenant-1", {
        id: "assign-1",
        courseId: 2,
        name: "Tugas Fisika Dasar",
        submissionType: "ONLINE_TEXT",
        status: "NEW",
        gradingStatus: "NOT_GRADED",
      });

      mockAssignmentRepo.getStudentAssignments.mockResolvedValue({
        items: [mockEntity],
        backendBlocked: false,
      });

      const useCase = new GetStudentAssignmentsUseCase(
        mockAssignmentRepo,
        mockClientFactory,
      );

      const result = await useCase.execute({
        actor: {
          id: "student-user",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
          moodleUserId: 10,
        },
        moodleToken: "valid-token",
      });

      expect(result.isSuccess).toBe(true);
      const val = result.getValue();
      expect(val.items.length).toBe(1);
      expect(val.items[0].name).toBe("Tugas Fisika Dasar");
    });
  });

  describe("SubmitAssignmentUseCase", () => {
    it("returns backend-contract-blocked error without faking submission success", async () => {
      const useCase = new SubmitAssignmentUseCase();
      const result = await useCase.execute({
        actor: {
          id: "student-user",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
          moodleUserId: 10,
        },
        assignmentId: "assign-1",
        data: {
          onlineText: "Jawaban tugas",
        },
        moodleToken: "token",
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain("backend-contract-blocked");
    });
  });
});
