// Files: src/modules/notification/__tests__/presentation/NotificationContext.test.tsx

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  NotificationProvider,
  useNotificationContext,
} from "@/modules/notification/presentation/context/NotificationContext";

function DummyConsumer() {
  const { unreadCount, activeTab } = useNotificationContext();
  return (
    <div data-testid="consumer">
      <span>Count: {unreadCount}</span>
      <span>Tab: {activeTab}</span>
    </div>
  );
}

describe("NotificationContext & NotificationProvider", () => {
  it("renders children and provides default context value", () => {
    const html = renderToStaticMarkup(
      <NotificationProvider userKey="student:john">
        <DummyConsumer />
      </NotificationProvider>,
    );

    expect(html).toContain("Count: 0");
    expect(html).toContain("Tab: unread");
  });

  it("throws error when useNotificationContext is used outside NotificationProvider", () => {
    expect(() => renderToStaticMarkup(<DummyConsumer />)).toThrow(
      "useNotificationContext must be used within a NotificationProvider",
    );
  });
});
