import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpStatus } from "@/core/http/HttpStatus";
import { AppRole } from "@/core/rbac/AppRole";

vi.mock("@/modules/auth/server/getCurrentUser", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/app/api/quizzes/_factory", () => {
  const mockController = {
    list: vi.fn(),
    getDetail: vi.fn(),
    checkAccess: vi.fn(),
  };
  return {
    getQuizController: () => mockController,
  };
});

import { getQuizController } from "@/app/api/quizzes/_factory";
import { GET as checkQuizAccess } from "@/app/api/quizzes/[quizId]/access/route";
import { GET as getQuizDetail } from "@/app/api/quizzes/[quizId]/route";
import { GET as getQuizzes } from "@/app/api/quizzes/route";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

describe("Quiz API Routes", () => {
  const mockController = getQuizController();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/quizzes", () => {
    it("returns 401 UNAUTHORIZED when no actor session exists", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost:3000/api/quizzes");
      const res = await getQuizzes(req);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(json.success).toBe(false);
      expect(mockController.list).not.toHaveBeenCalled();
    });

    it("delegates to controller when authenticated actor is present", async () => {
      const actor = {
        userId: "student-1",
        email: "student@example.com",
        role: AppRole.STUDENT,
        tenantId: "tenant-1",
      };
      vi.mocked(getCurrentUser).mockResolvedValueOnce(actor as any);
      vi.mocked(mockController.list).mockResolvedValueOnce(
        NextResponse.json({ success: true, data: { quizzes: [], total: 0 } }),
      );

      const req = new NextRequest(
        "http://localhost:3000/api/quizzes?courseId=10",
      );
      const res = await getQuizzes(req);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.OK);
      expect(json.success).toBe(true);
      expect(mockController.list).toHaveBeenCalledWith(actor, req);
    });
  });

  describe("GET /api/quizzes/[quizId]", () => {
    it("returns 401 UNAUTHORIZED when no actor session exists", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost:3000/api/quizzes/101");
      const context = { params: Promise.resolve({ quizId: "101" }) };
      const res = await getQuizDetail(req, context);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(mockController.getDetail).not.toHaveBeenCalled();
    });

    it("delegates to controller when authenticated", async () => {
      const actor = {
        userId: "student-1",
        email: "student@example.com",
        role: AppRole.STUDENT,
        tenantId: "tenant-1",
      };
      vi.mocked(getCurrentUser).mockResolvedValueOnce(actor as any);
      vi.mocked(mockController.getDetail).mockResolvedValueOnce(
        NextResponse.json({ success: true, data: { id: 101 } }),
      );

      const req = new NextRequest("http://localhost:3000/api/quizzes/101");
      const context = { params: Promise.resolve({ quizId: "101" }) };
      const res = await getQuizDetail(req, context);

      expect(res.status).toBe(HttpStatus.OK);
      expect(mockController.getDetail).toHaveBeenCalledWith(actor, "101");
    });
  });

  describe("GET /api/quizzes/[quizId]/access", () => {
    it("returns 401 UNAUTHORIZED when no actor session exists", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

      const req = new NextRequest(
        "http://localhost:3000/api/quizzes/101/access",
      );
      const context = { params: Promise.resolve({ quizId: "101" }) };
      const res = await checkQuizAccess(req, context);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(mockController.checkAccess).not.toHaveBeenCalled();
    });

    it("delegates to controller when authenticated", async () => {
      const actor = {
        userId: "student-1",
        email: "student@example.com",
        role: AppRole.STUDENT,
        tenantId: "tenant-1",
      };
      vi.mocked(getCurrentUser).mockResolvedValueOnce(actor as any);
      vi.mocked(mockController.checkAccess).mockResolvedValueOnce(
        NextResponse.json({ success: true, data: { canAttempt: true } }),
      );

      const req = new NextRequest(
        "http://localhost:3000/api/quizzes/101/access",
      );
      const context = { params: Promise.resolve({ quizId: "101" }) };
      const res = await checkQuizAccess(req, context);

      expect(res.status).toBe(HttpStatus.OK);
      expect(mockController.checkAccess).toHaveBeenCalledWith(actor, "101");
    });
  });
});
