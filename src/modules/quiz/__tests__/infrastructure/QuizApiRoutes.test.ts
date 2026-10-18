import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpStatus } from "@/core/http/HttpStatus";

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

describe("Quiz API Routes", () => {
  const mockController = getQuizController();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/quizzes", () => {
    it("delegates to controller.list(req)", async () => {
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
      expect(mockController.list).toHaveBeenCalledWith(req);
    });
  });

  describe("GET /api/quizzes/[quizId]", () => {
    it("delegates to controller.getDetail(quizId)", async () => {
      vi.mocked(mockController.getDetail).mockResolvedValueOnce(
        NextResponse.json({ success: true, data: { id: 101 } }),
      );

      const req = new NextRequest("http://localhost:3000/api/quizzes/101");
      const context = { params: Promise.resolve({ quizId: "101" }) };
      const res = await getQuizDetail(req, context);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.OK);
      expect(json.success).toBe(true);
      expect(mockController.getDetail).toHaveBeenCalledWith("101");
    });
  });

  describe("GET /api/quizzes/[quizId]/access", () => {
    it("delegates to controller.checkAccess(quizId)", async () => {
      vi.mocked(mockController.checkAccess).mockResolvedValueOnce(
        NextResponse.json({ success: true, data: { canAttempt: true } }),
      );

      const req = new NextRequest(
        "http://localhost:3000/api/quizzes/101/access",
      );
      const context = { params: Promise.resolve({ quizId: "101" }) };
      const res = await checkQuizAccess(req, context);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.OK);
      expect(json.success).toBe(true);
      expect(mockController.checkAccess).toHaveBeenCalledWith("101");
    });
  });
});
