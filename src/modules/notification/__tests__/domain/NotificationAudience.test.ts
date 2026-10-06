// Files: src/modules/notification/__tests__/domain/NotificationAudience.test.ts

import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import {
  NotificationAudienceScope,
  NotificationOwnerScope,
} from "@/modules/notification/domain/types/NotificationTypes";
import { NotificationAudience } from "@/modules/notification/domain/value-object/NotificationAudience";

describe("NotificationAudience Value Object", () => {
  it("enforces tenant actor can only target their own tenant", () => {
    const audience = NotificationAudience.create(
      { scope: NotificationAudienceScope.ALL },
      NotificationOwnerScope.TENANT,
      "tenant-100",
    );

    expect(audience.tenantIds).toEqual(["tenant-100"]);
  });

  it("throws ForbiddenError if tenant actor tries to target another tenant", () => {
    expect(() => {
      NotificationAudience.create(
        { scope: NotificationAudienceScope.TENANT, tenantIds: ["tenant-999"] },
        NotificationOwnerScope.TENANT,
        "tenant-100",
      );
    }).toThrow(ForbiddenError);
  });

  it("allows platform admin to target multiple tenants or all tenants", () => {
    const audience = NotificationAudience.create(
      {
        scope: NotificationAudienceScope.TENANT,
        tenantIds: ["tenant-1", "tenant-2"],
      },
      NotificationOwnerScope.PLATFORM,
      null,
    );

    expect(audience.tenantIds).toEqual(["tenant-1", "tenant-2"]);
  });
});
