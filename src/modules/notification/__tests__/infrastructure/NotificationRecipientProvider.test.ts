import { beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({
  tenants: vi.fn(),
  course: vi.fn(),
  enrolment: vi.fn(),
}));
vi.mock("@/libs/prisma", () => ({
  prisma: { tenant: { findMany: state.tenants } },
}));
import { NotificationRecipientProvider } from "@/modules/notification/infrastructure/providers/NotificationRecipientProvider";
import { NotificationAudienceScope, NotificationOwnerScope } from "@/modules/notification/domain/types/NotificationTypes";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
describe("Moodle-based notification audiences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.tenants.mockResolvedValue([{ id: "tenant-a", slug: "a", status: "ACTIVE" }, { id: "tenant-b", slug: "b", status: "ACTIVE" }]);
    state.course.mockResolvedValue([{ id: 1 }, { id: 17 }]);
    state.enrolment.mockResolvedValue([
      { id: 21, fullname: "Siswa", roles: [{ shortname: "student" }] },
      { id: 22, fullname: "Guru", roles: [{ shortname: "editingteacher" }] },
    ]);
  });
  const create = () => new NotificationRecipientProvider({
    createClientForTenant: vi.fn(async () => ({
      call: vi.fn(async (fn: string) => fn === "core_course_get_courses"
        ? state.course()
        : state.enrolment()),
    })),
  } as unknown as MoodleClientFactory);
  it("resolves two tenants without a device token or synthetic recipient", async () => {
    const users = await create().resolveRecipients({ scope: NotificationAudienceScope.ALL }, NotificationOwnerScope.PLATFORM, null);
    expect(users.map(u => u.recipientId)).toEqual(["moodle:tenant-a:21", "moodle:tenant-b:21"]);
    expect(users.every(u => u.role === "STUDENT" && u.tenantId !== null)).toBe(true);
  });
  it("does not select teachers for a student audience", async () => {
    const users = await create().resolveRecipients({ scope: NotificationAudienceScope.ROLES, roles: ["STUDENT"] }, NotificationOwnerScope.PLATFORM, null);
    expect(users).toHaveLength(2);
  });
  it("rejects forged tenant IDs", async () => {
    await expect(create().resolveRecipients({
      scope: NotificationAudienceScope.TENANT, tenantIds: ["tenant-b"],
    }, NotificationOwnerScope.TENANT, "tenant-a")).rejects.toThrow();
  });
  it("rejects unverified explicit user IDs", async () => {
    await expect(create().resolveRecipients({
      scope: NotificationAudienceScope.USERS, userIds: ["999"],
    }, NotificationOwnerScope.PLATFORM, null)).rejects.toThrow();
  });
  it("returns zero for empty enrolled courses", async () => {
    state.enrolment.mockResolvedValue([]);
    expect(await create().getAudienceCount({scope:NotificationAudienceScope.ALL},NotificationOwnerScope.PLATFORM,null)).toBe(0);
  });
});
