import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpStatus } from "@/core/http/HttpStatus";
import { AppRole } from "@/core/rbac/AppRole";

vi.mock("@/modules/auth/server/getCurrentSession", () => ({
  getCurrentSession: vi.fn(),
}));

vi.mock("@/app/api/courses/_factory", () => {
  const mockController = {
    list: vi.fn(),
    getContents: vi.fn(),
    getDetail: vi.fn(),
  };
  return {
    getCourseController: () => mockController,
  };
});

import { getCourseController } from "@/app/api/courses/_factory";
import { GET as getContents } from "@/app/api/courses/[courseId]/contents/route";
import { GET as getCourses } from "@/app/api/courses/route";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

describe("Course API Routes", () => {
  const mockController = getCourseController();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/courses", () => {
    it("returns 401 UNAUTHORIZED when no actor session exists", async () => {
      vi.mocked(getCurrentSession).mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost:3000/api/courses");
      const res = await getCourses(req);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("UNAUTHORIZED");
      expect(mockController.list).not.toHaveBeenCalled();
    });

    it("delegates to controller when authenticated actor is present", async () => {
      const session = {
        sessionId: "sess-1",
        actor: {
          userId: "student-1",
          email: "student@example.com",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
        },
        moodleToken: "student-moodle-token",
      };
      vi.mocked(getCurrentSession).mockResolvedValueOnce(session as any);
      vi.mocked(mockController.list).mockResolvedValueOnce(
        NextResponse.json({ success: true, data: { courses: [], total: 0 } }),
      );

      const req = new NextRequest("http://localhost:3000/api/courses");
      const res = await getCourses(req);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.OK);
      expect(json.success).toBe(true);
      expect(mockController.list).toHaveBeenCalledWith(
        session.actor,
        req,
        "student-moodle-token",
      );
    });
  });

  describe("GET /api/courses/[courseId]/contents", () => {
    it("returns 401 UNAUTHORIZED when no actor session exists", async () => {
      vi.mocked(getCurrentSession).mockResolvedValueOnce(null);

      const req = new NextRequest(
        "http://localhost:3000/api/courses/10/contents",
      );
      const context = { params: Promise.resolve({ courseId: "10" }) };
      const res = await getContents(req, context);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(json.success).toBe(false);
      expect(mockController.getContents).not.toHaveBeenCalled();
    });

    it("delegates to controller when courseId is provided", async () => {
      const session = {
        sessionId: "sess-1",
        actor: {
          userId: "student-1",
          email: "student@example.com",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
        },
        moodleToken: "student-moodle-token",
      };
      vi.mocked(getCurrentSession).mockResolvedValueOnce(session as any);
      vi.mocked(mockController.getContents).mockResolvedValueOnce(
        NextResponse.json({ success: true, data: [] }),
      );

      const req = new NextRequest(
        "http://localhost:3000/api/courses/101/contents",
      );
      const context = { params: Promise.resolve({ courseId: "101" }) };
      const res = await getContents(req, context);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.OK);
      expect(json.success).toBe(true);
      expect(mockController.getContents).toHaveBeenCalledWith(
        session.actor,
        "101",
        "student-moodle-token",
      );
    });
  });
});
