import { describe, it, expect } from "vitest";
import { isAdminUser, parseAdminEmails } from "./auth";

describe("parseAdminEmails", () => {
  it("parses comma-separated emails and normalizes casing", () => {
    expect(parseAdminEmails(" Admin@Example.com, hello@test.com ")).toEqual([
      "admin@example.com",
      "hello@test.com",
    ]);
  });

  it("returns an empty array for missing or blank input", () => {
    expect(parseAdminEmails()).toEqual([]);
    expect(parseAdminEmails("  ,  ")).toEqual([]);
  });
});

describe("isAdminUser", () => {
  it("allows users with app_metadata.role admin", () => {
    expect(
      isAdminUser({ email: "anyone@example.com", app_metadata: { role: "admin" } }),
    ).toBe(true);
  });

  it("allows users whose email is in the allowlist", () => {
    expect(
      isAdminUser(
        { email: "Admin@Example.com", app_metadata: {} },
        ["admin@example.com"],
      ),
    ).toBe(true);
  });

  it("rejects users without admin role or allowlisted email", () => {
    expect(
      isAdminUser(
        { email: "other@example.com", app_metadata: { role: "editor" } },
        ["admin@example.com"],
      ),
    ).toBe(false);
  });

  it("rejects users with no email when allowlist is configured", () => {
    expect(isAdminUser({ app_metadata: { role: "admin" } }, ["admin@example.com"])).toBe(
      true,
    );
    expect(isAdminUser({ app_metadata: {} }, ["admin@example.com"])).toBe(false);
  });
});
