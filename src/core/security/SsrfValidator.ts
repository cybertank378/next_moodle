import { SecurityError } from "@/core/errors/SecurityError";
import { ValidationError } from "@/core/errors/ValidationError";

/**
 * Validates outgoing URLs to prevent Server-Side Request Forgery (SSRF).
 * Rejects loopback, private RFC 1918 addresses, cloud metadata endpoints, and non-HTTP(S) protocols.
 */
export class SsrfValidator {
  private readonly allowPrivateForTests: boolean;

  constructor(options?: { allowPrivateForTests?: boolean }) {
    this.allowPrivateForTests =
      options?.allowPrivateForTests ??
      process.env.ALLOW_PRIVATE_NETWORK_FOR_TESTS === "true";
  }

  /**
   * Validates a URL string against SSRF attack vectors.
   * Throws ValidationError or SecurityError if the URL is invalid or restricted.
   */
  validateUrl(urlStr: string): URL {
    if (!urlStr || typeof urlStr !== "string" || urlStr.trim() === "") {
      throw new ValidationError("URL string is required for SSRF validation");
    }

    let parsed: URL;
    try {
      parsed = new URL(urlStr.trim());
    } catch {
      throw new ValidationError(`Malformed URL: "${urlStr}"`);
    }

    // Protocol enforcement
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new SecurityError(
        `Invalid protocol: only http: and https: are permitted, received "${parsed.protocol}"`,
        { protocol: parsed.protocol },
      );
    }

    if (this.allowPrivateForTests) {
      return parsed;
    }

    const rawHostname = parsed.hostname.toLowerCase().trim();
    // Strip brackets from IPv6 hostnames: e.g. [::1] -> ::1
    const hostname =
      rawHostname.startsWith("[") && rawHostname.endsWith("]")
        ? rawHostname.slice(1, -1)
        : rawHostname;

    // Check for loopback hostnames
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname === "0.0.0.0"
    ) {
      throw new SecurityError(
        `SSRF blocked: host "${hostname}" is a restricted loopback or local target`,
        { hostname },
      );
    }

    // Check IPv4 ranges
    if (this.isRestrictedIpv4(hostname)) {
      throw new SecurityError(
        `SSRF blocked: IP "${hostname}" is in a private, loopback, or cloud-metadata network range`,
        { hostname },
      );
    }

    // Check IPv6 ranges
    if (this.isRestrictedIpv6(hostname)) {
      throw new SecurityError(
        `SSRF blocked: IPv6 "${hostname}" is in a restricted network range`,
        { hostname },
      );
    }

    return parsed;
  }

  private isRestrictedIpv4(ip: string): boolean {
    const parts = ip.split(".");
    if (parts.length !== 4) return false;

    const octets = parts.map((p) => Number.parseInt(p, 10));
    if (octets.some((o) => Number.isNaN(o) || o < 0 || o > 255)) {
      return false;
    }

    const [a, b] = octets;

    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;

    // 0.0.0.0/8 (Current network)
    if (a === 0) return true;

    // 10.0.0.0/8 (RFC 1918 Private)
    if (a === 10) return true;

    // 172.16.0.0/12 (RFC 1918 Private: 172.16.x.x - 172.31.x.x)
    if (a === 172 && b >= 16 && b <= 31) return true;

    // 192.168.0.0/16 (RFC 1918 Private)
    if (a === 192 && b === 168) return true;

    // 169.254.0.0/16 (Link-Local / Cloud Metadata 169.254.169.254)
    if (a === 169 && b === 254) return true;

    // 100.64.0.0/10 (Carrier-grade NAT)
    if (a === 100 && b >= 64 && b <= 127) return true;

    return false;
  }

  private isRestrictedIpv6(ip: string): boolean {
    const normalized = ip.toLowerCase();

    // ::1 (Loopback) or :: (Unspecified)
    if (normalized === "::1" || normalized === "::") return true;

    // IPv4-mapped IPv6: ::ffff:127.0.0.1
    if (normalized.startsWith("::ffff:")) {
      const ipv4Part = normalized.replace("::ffff:", "");
      return this.isRestrictedIpv4(ipv4Part);
    }

    // Unique Local Addresses (fc00::/7)
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;

    // Link-local addresses (fe80::/10)
    if (
      normalized.startsWith("fe8") ||
      normalized.startsWith("fe9") ||
      normalized.startsWith("fea") ||
      normalized.startsWith("feb")
    ) {
      return true;
    }

    return false;
  }
}

export const ssrfValidator = new SsrfValidator();
