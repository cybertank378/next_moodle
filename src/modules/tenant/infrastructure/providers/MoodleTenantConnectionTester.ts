import "server-only";
import { MoodleError } from "@/core/errors/MoodleError";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { TestTenantConnectionResponseDTO } from "../../domain/dto/TestTenantConnectionResponseDTO";
import type { Tenant } from "../../domain/entities/Tenant";
import type { TenantConnectionTester } from "../../domain/interfaces/TenantConnectionTester";

interface MoodleSiteInfoRaw {
  readonly sitename?: string;
  readonly release?: string;
  readonly version?: string;
}

export class MoodleTenantConnectionTester implements TenantConnectionTester {
  constructor(private readonly clientFactory: MoodleClientFactory) {}

  public async testConnection(
    tenant: Tenant,
  ): Promise<TestTenantConnectionResponseDTO> {
    try {
      const client = await this.clientFactory.create({
        tenant: {
          tenantId: tenant.id,
          slug: tenant.slug,
          name: tenant.name,
          status: tenant.status,
        },
      });

      const siteInfo = await client.call<MoodleSiteInfoRaw>(
        "core_webservice_get_site_info",
      );

      return {
        success: true,
        message: "Koneksi ke Moodle berhasil.",
        siteName: siteInfo?.sitename,
        moodleVersion: siteInfo?.release,
      };
    } catch (error) {
      if (error instanceof MoodleError) {
        if (
          error.code === "MOODLE_INVALID_TOKEN" ||
          error.moodleErrorCode === "invalidtoken"
        ) {
          return {
            success: false,
            message:
              "Token atau credential Moodle tidak valid atau tidak memiliki izin webservice.",
          };
        }

        if (error.code === "MOODLE_TIMEOUT") {
          return {
            success: false,
            message: "Waktu koneksi ke Moodle habis (Timeout).",
          };
        }

        if (error.code === "MOODLE_NETWORK_ERROR") {
          return {
            success: false,
            message:
              "Server Moodle tidak dapat dijangkau. Periksa kembali host URL dan jaringan.",
          };
        }

        return {
          success: false,
          message: `Gagal berkomunikasi dengan Moodle: ${error.message}`,
        };
      }

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menguji koneksi ke Moodle.",
      };
    }
  }
}
