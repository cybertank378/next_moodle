import { describe, expect, it, vi } from "vitest";
import { MoodlePreflight } from "@/core/moodle/MoodlePreflight";
import type { MoodleClient } from "@/core/moodle/types";

describe("MoodlePreflight", () => {
  it("accepts the audited local_examapi API v1/component contract", async () => {
    const client: MoodleClient = {
      call: vi.fn().mockImplementation((fn: string) => {
        if (fn === "core_webservice_get_site_info")
          return { sitename: "Exam LMS" };
        if (fn === "local_examapi_get_health") {
          return {
            status: "ok",
            component: "local_examapi",
            apiversion: 1,
            pluginversion: 2026092101,
            timestamp: 1,
          };
        }
        if (fn === "local_examapi_get_api_version") {
          return {
            component: "local_examapi",
            apiversion: 1,
            minclientversion: 1,
            status: "ok",
          };
        }
        return {
          can_view: true,
          can_monitor: false,
          can_manage_attempts: false,
          can_view_reports: false,
          can_manage: false,
          supported_features: [],
        };
      }),
    };

    await expect(new MoodlePreflight().check(client)).resolves.toMatchObject({
      status: "compatible",
      compatible: true,
      component: "local_examapi",
      apiVersion: 1,
      pluginVersion: 2026092101,
      missingRequired: [],
    });
  });

  it("returns incompatible when a required function is missing", async () => {
    const client: MoodleClient = {
      call: vi.fn().mockImplementation((fn: string) => {
        if (fn === "core_webservice_get_site_info") return {};
        if (fn === "local_examapi_get_health") {
          return {
            status: "ok",
            component: "local_examapi",
            apiversion: 1,
            pluginversion: 2026092101,
            timestamp: 1,
          };
        }
        if (fn === "local_examapi_get_api_version") {
          return {
            component: "local_examapi",
            apiversion: 1,
            minclientversion: 1,
            status: "ok",
          };
        }
        throw new Error("Function does not exist");
      }),
    };

    const result = await new MoodlePreflight().check(client);
    expect(result.compatible).toBe(false);
    expect(result.status).toBe("incompatible");
    expect(result.missingRequired).toContain("local_examapi_get_capabilities");
  });

  it("rejects a mismatched component or API major", async () => {
    const client: MoodleClient = {
      call: vi.fn().mockImplementation((fn: string) => {
        if (fn === "local_examapi_get_health") {
          return {
            status: "ok",
            component: "evil_plugin",
            apiversion: 2,
            pluginversion: 2026092101,
            timestamp: 1,
          };
        }
        if (fn === "local_examapi_get_api_version") {
          return {
            component: "evil_plugin",
            apiversion: 2,
            minclientversion: 2,
            status: "ok",
          };
        }
        if (fn === "local_examapi_get_capabilities")
          return { supported_features: [] };
        return {};
      }),
    };

    const result = await new MoodlePreflight().check(client);
    expect(result).toMatchObject({ status: "incompatible", compatible: false });
    expect(result.reasons.join(" ")).toMatch(/component|API/i);
  });
});
