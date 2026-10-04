import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { TenantSummaryResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDto";
import TenantTable from "@/sections/tenant/molecules/TenantTable";
import Pagination from "@/shared-ui/component/Pagination";

describe("TenantTable & Pagination Component Testing", () => {
  const sampleTenants: TenantSummaryResponseDTO[] = [
    {
      id: "tenant-1",
      name: "SMK Negeri 1",
      slug: "smkn1",
      status: "ACTIVE",
      hasMoodleCredential: true,
      hasBranding: false,
      customDomain: "ujian.smkn1.sch.id",
      createdAt: "2026-09-20T10:00:00.000Z",
      updatedAt: "2026-09-21T10:00:00.000Z",
    },
    {
      id: "tenant-2",
      name: "SMA Swasta 2",
      slug: "smas2",
      status: "MAINTENANCE",
      hasMoodleCredential: false,
      hasBranding: false,
      customDomain: null,
      createdAt: "2026-09-22T10:00:00.000Z",
      updatedAt: "2026-09-22T10:00:00.000Z",
    },
  ];

  describe("TenantTable", () => {
    it("renders loading skeletons when loading is true", () => {
      const html = renderToStaticMarkup(
        <TenantTable tenants={[]} loading={true} />,
      );

      expect(html).toContain("shimmer");
      expect(html).not.toContain("SMK Negeri 1");
      expect(html).not.toContain("Belum ada tenant");
    });

    it("renders empty state when tenants array is empty and loading is false", () => {
      const html = renderToStaticMarkup(
        <TenantTable tenants={[]} loading={false} />,
      );

      expect(html).toContain("Belum ada tenant");
      expect(html).toContain("Data tenant yang sesuai filter belum tersedia.");
      expect(html).not.toContain("shimmer");
    });

    it("renders table rows with tenant metadata and action links", () => {
      const html = renderToStaticMarkup(
        <TenantTable tenants={sampleTenants} loading={false} />,
      );

      // Names & slugs
      expect(html).toContain("SMK Negeri 1");
      expect(html).toContain("smkn1");
      expect(html).toContain("SMA Swasta 2");
      expect(html).toContain("smas2");

      // Status badges
      expect(html).toContain("ACTIVE");
      expect(html).toContain("MAINTENANCE");

      // Credential status
      expect(html).toContain("Terkonfigurasi");
      expect(html).toContain("Belum");

      // Custom domain
      expect(html).toContain("ujian.smkn1.sch.id");
      expect(html).toContain("—");

      // Action links
      expect(html).toContain('/dashboard/tenants/tenant-1"');
      expect(html).toContain('/dashboard/tenants/tenant-1/edit"');
      expect(html).toContain('/dashboard/tenants/tenant-2"');
      expect(html).toContain('/dashboard/tenants/tenant-2/edit"');
    });
  });

  describe("Pagination", () => {
    it("renders correct summary for non-empty items", () => {
      const onPageChange = vi.fn();
      const html = renderToStaticMarkup(
        <Pagination
          currentPage={1}
          totalItems={25}
          itemsPerPage={10}
          onPageChangeAction={onPageChange}
        />,
      );

      expect(html).toContain("Menampilkan 1 hingga 10 dari total 25 data");
      expect(html).toContain("1");
      expect(html).toContain("2");
      expect(html).toContain("3");
    });

    it("renders empty data indicator when totalItems is 0", () => {
      const onPageChange = vi.fn();
      const html = renderToStaticMarkup(
        <Pagination
          currentPage={1}
          totalItems={0}
          itemsPerPage={10}
          onPageChangeAction={onPageChange}
        />,
      );

      expect(html).toContain("Tidak ada data");
    });

    it("calculates page window with ellipsis for multiple pages", () => {
      const onPageChange = vi.fn();
      const html = renderToStaticMarkup(
        <Pagination
          currentPage={5}
          totalItems={100}
          itemsPerPage={10}
          onPageChangeAction={onPageChange}
        />,
      );

      expect(html).toContain("Menampilkan 41 hingga 50 dari total 100 data");
      expect(html).toContain("...");
      expect(html).toContain("10");
    });
  });
});
