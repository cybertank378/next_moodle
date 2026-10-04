import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ResultsEmptyState from "@/sections/results/atoms/ResultsEmptyState";

describe("ResultsEmptyState", () => {
  it("renders default title and description", () => {
    const html = renderToStaticMarkup(<ResultsEmptyState />);
    expect(html).toContain("Tidak ada data nilai");
    expect(html).toContain("Belum ada rekaman penilaian");
    expect(html).toContain("results-empty-state");
  });

  it("renders custom title, description, and retry button when onRetry is provided", () => {
    const onRetry = vi.fn();
    const html = renderToStaticMarkup(
      <ResultsEmptyState
        title="Belum ada peserta dinilai"
        description="Silakan coba lagi nanti."
        onRetry={onRetry}
      />,
    );
    expect(html).toContain("Belum ada peserta dinilai");
    expect(html).toContain("Silakan coba lagi nanti.");
    expect(html).toContain("Muat Ulang");
  });
});
