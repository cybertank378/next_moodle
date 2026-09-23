import "server-only";

import type { MoodleClient } from "./types";

const EXPECTED_COMPONENT = "local_examapi";
const EXPECTED_API_VERSION = 1;
const MINIMUM_PLUGIN_VERSION = 2026092101;

const REQUIRED_FUNCTIONS = [
  "core_webservice_get_site_info",
  "local_examapi_get_health",
  "local_examapi_get_api_version",
  "local_examapi_get_capabilities",
] as const;

type RequiredFunction = (typeof REQUIRED_FUNCTIONS)[number];

interface HealthContract {
  status: string;
  component: string;
  apiversion: number;
  pluginversion: number;
}

interface VersionContract {
  status: string;
  component: string;
  apiversion: number;
  minclientversion: number;
}

export interface MoodleCapabilities {
  canView: boolean;
  canMonitor: boolean;
  canManageAttempts: boolean;
  canViewReports: boolean;
  supportedFeatures: readonly string[];
}

export type MoodlePreflightStatus = "compatible" | "degraded" | "incompatible";

export interface MoodlePreflightResult {
  status: MoodlePreflightStatus;
  compatible: boolean;
  component?: string;
  apiVersion?: number;
  pluginVersion?: number;
  capabilities?: MoodleCapabilities;
  missingRequired: readonly RequiredFunction[];
  reasons: readonly string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseHealth(value: unknown): HealthContract | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.status !== "string" ||
    typeof value.component !== "string" ||
    typeof value.apiversion !== "number" ||
    typeof value.pluginversion !== "number"
  ) {
    return null;
  }
  return {
    status: value.status,
    component: value.component,
    apiversion: value.apiversion,
    pluginversion: value.pluginversion,
  };
}

function parseVersion(value: unknown): VersionContract | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.status !== "string" ||
    typeof value.component !== "string" ||
    typeof value.apiversion !== "number" ||
    typeof value.minclientversion !== "number"
  ) {
    return null;
  }
  return {
    status: value.status,
    component: value.component,
    apiversion: value.apiversion,
    minclientversion: value.minclientversion,
  };
}

function parseCapabilities(value: unknown): MoodleCapabilities | null {
  if (!isRecord(value) || !Array.isArray(value.supported_features)) {
    return null;
  }
  const features = value.supported_features.filter(
    (feature): feature is string => typeof feature === "string",
  );
  return {
    canView: value.can_view === true,
    canMonitor: value.can_monitor === true,
    canManageAttempts: value.can_manage_attempts === true,
    canViewReports: value.can_view_reports === true,
    supportedFeatures: features,
  };
}

export class MoodlePreflight {
  async check(client: MoodleClient): Promise<MoodlePreflightResult> {
    const responses = new Map<RequiredFunction, unknown>();
    const missingRequired: RequiredFunction[] = [];

    for (const wsfunction of REQUIRED_FUNCTIONS) {
      try {
        const response = await client.call(
          wsfunction,
          {},
          {
            requestKind: "safe-read",
            maxRetries: 1,
          },
        );
        responses.set(wsfunction, response);
      } catch {
        missingRequired.push(wsfunction);
      }
    }

    const reasons: string[] = [];
    if (missingRequired.length > 0) {
      reasons.push("One or more required Moodle functions are unavailable.");
    }

    const health = parseHealth(responses.get("local_examapi_get_health"));
    const version = parseVersion(
      responses.get("local_examapi_get_api_version"),
    );
    const capabilities = parseCapabilities(
      responses.get("local_examapi_get_capabilities"),
    );

    if (!health && !missingRequired.includes("local_examapi_get_health")) {
      reasons.push("Health response does not match the audited contract.");
    }
    if (
      !version &&
      !missingRequired.includes("local_examapi_get_api_version")
    ) {
      reasons.push("API version response does not match the audited contract.");
    }
    if (
      !capabilities &&
      !missingRequired.includes("local_examapi_get_capabilities")
    ) {
      reasons.push("Capability response does not match the audited contract.");
    }

    const component = version?.component ?? health?.component;
    const apiVersion = version?.apiversion ?? health?.apiversion;
    if (component !== undefined && component !== EXPECTED_COMPONENT) {
      reasons.push("Moodle plugin component is incompatible.");
    }
    if (apiVersion !== undefined && apiVersion !== EXPECTED_API_VERSION) {
      reasons.push("Moodle plugin API major version is incompatible.");
    }
    if (health && health.pluginversion < MINIMUM_PLUGIN_VERSION) {
      reasons.push("Moodle plugin version is below the supported baseline.");
    }
    if (version && version.minclientversion > EXPECTED_API_VERSION) {
      reasons.push("Moodle plugin requires a newer client API version.");
    }

    const incompatible = reasons.length > 0;
    const degraded = !incompatible && health?.status !== "ok";

    return {
      status: incompatible
        ? "incompatible"
        : degraded
          ? "degraded"
          : "compatible",
      compatible: !incompatible,
      ...(component ? { component } : {}),
      ...(apiVersion !== undefined ? { apiVersion } : {}),
      ...(health ? { pluginVersion: health.pluginversion } : {}),
      ...(capabilities ? { capabilities } : {}),
      missingRequired,
      reasons,
    };
  }
}
