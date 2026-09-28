import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GradeStatusBadge from "../../atoms/GradeStatusBadge";

describe("GradeStatusBadge", () => {
  it("renders Lulus for passed status (isPassed=true)", () => {
    const html = renderToStaticMarkup(<GradeStatusBadge isPassed={true} />);
    expect(html).toContain("Lulus");
    expect(html).toContain("status-passed");
  });

  it("renders Tidak Lulus for failed status (isPassed=false)", () => {
    const html = renderToStaticMarkup(<GradeStatusBadge isPassed={false} />);
    expect(html).toContain("Tidak Lulus");
    expect(html).toContain("status-failed");
  });

  it("renders Belum Dinilai for null status (isPassed=null)", () => {
    const html = renderToStaticMarkup(<GradeStatusBadge isPassed={null} />);
    expect(html).toContain("Belum Dinilai");
    expect(html).toContain("status-unassessed");
  });
});
