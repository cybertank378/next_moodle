import { describe, expect, it } from "vitest";
import { SsrfValidator } from "@/core/security/SsrfValidator";

describe("SsrfValidator", () => {
  const validator = new SsrfValidator();

  it("should accept valid public HTTPS and HTTP URLs", () => {
    expect(() =>
      validator.validateUrl(
        "https://moodle.examcenter.edu/webservice/rest/server.php",
      ),
    ).not.toThrow();

    expect(() =>
      validator.validateUrl("http://moodle-public.org"),
    ).not.toThrow();
  });

  it("should reject non-HTTP/HTTPS protocols", () => {
    expect(() => validator.validateUrl("ftp://moodle.exam.edu")).toThrow(
      /protocol/i,
    );
    expect(() => validator.validateUrl("file:///etc/passwd")).toThrow(
      /protocol/i,
    );
    expect(() => validator.validateUrl("gopher://evil.com")).toThrow(
      /protocol/i,
    );
  });

  it("should reject loopback addresses", () => {
    expect(() => validator.validateUrl("http://localhost/moodle")).toThrow(
      /SSRF/i,
    );
    expect(() => validator.validateUrl("http://127.0.0.1:8080")).toThrow(
      /SSRF/i,
    );
    expect(() => validator.validateUrl("http://127.0.1.1")).toThrow(/SSRF/i);
    expect(() => validator.validateUrl("http://[::1]:8080")).toThrow(/SSRF/i);
  });

  it("should reject private RFC 1918 IPv4 ranges", () => {
    // 10.0.0.0/8
    expect(() => validator.validateUrl("https://10.0.1.50/moodle")).toThrow(
      /SSRF/i,
    );
    // 172.16.0.0/12
    expect(() => validator.validateUrl("https://172.16.0.1")).toThrow(/SSRF/i);
    expect(() => validator.validateUrl("https://172.31.255.255")).toThrow(
      /SSRF/i,
    );
    // 192.168.0.0/16
    expect(() => validator.validateUrl("https://192.168.1.100/moodle")).toThrow(
      /SSRF/i,
    );
  });

  it("should reject cloud metadata service IPv4 (169.254.169.254)", () => {
    expect(() =>
      validator.validateUrl("http://169.254.169.254/latest/meta-data/"),
    ).toThrow(/SSRF/i);
    expect(() => validator.validateUrl("http://169.254.0.1")).toThrow(/SSRF/i);
  });

  it("should reject malformed or empty URLs", () => {
    expect(() => validator.validateUrl("")).toThrow();
    expect(() => validator.validateUrl("not-a-valid-url")).toThrow();
  });
});
