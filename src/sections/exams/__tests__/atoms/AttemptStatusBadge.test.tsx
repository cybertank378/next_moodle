import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AttemptStatusBadge from "../../atoms/AttemptStatusBadge";

describe("AttemptStatusBadge", () => {
  it("renders Siap for ready status", () => {
    const html = renderToStaticMarkup(<AttemptStatusBadge status="ready" />);
    expect(html).toContain("Siap");
  });

  it("renders Menyimpan... for saving status", () => {
    const html = renderToStaticMarkup(<AttemptStatusBadge status="saving" />);
    expect(html).toContain("Menyimpan...");
  });

  it("renders Tersimpan for saved status", () => {
    const html = renderToStaticMarkup(<AttemptStatusBadge status="saved" />);
    expect(html).toContain("Tersimpan");
  });

  it("renders Offline for offline status", () => {
    const html = renderToStaticMarkup(<AttemptStatusBadge status="offline" />);
    expect(html).toContain("Offline");
    expect(html).toContain("Antrean Aktif");
  });

  it("renders Mengirim Ujian... for submitting status", () => {
    const html = renderToStaticMarkup(
      <AttemptStatusBadge status="submitting" />,
    );
    expect(html).toContain("Mengirim Ujian...");
  });
});
