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

  it("drops empty segments from a comma-separated list", () => {
    expect(parseAdminEmails("admin@example.com,, ,other@example.com")).toEqual([
      "admin@example.com",
      "other@example.com",
    ]);
  });
});

describe("isAdminUser", () => {
  it("allows users with app_metadata.role admin", () => {
    expect(
      isAdminUser({
        email: "anyone@example.com",
        app_metadata: { role: "admin" },
      }),
    ).toBe(true);
  });

  it("allows users whose email is in the allowlist", () => {
    expect(
      isAdminUser({ email: "Admin@Example.com", app_metadata: {} }, [
        "admin@example.com",
      ]),
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
    expect(
      isAdminUser({ app_metadata: { role: "admin" } }, ["admin@example.com"]),
    ).toBe(true);
    expect(isAdminUser({ app_metadata: {} }, ["admin@example.com"])).toBe(
      false,
    );
  });

  it("trims and lowercases the user email before an allowlist comparison", () => {
    expect(
      isAdminUser({ email: "  Admin@Example.com  " }, ["admin@example.com"]),
    ).toBe(true);
  });

  it("rejects blank emails, embedded spaces, and near-miss admin roles", () => {
    expect(isAdminUser({ email: "   " }, ["admin@example.com"])).toBe(false);
    expect(
      isAdminUser({ email: "admin @example.com" }, ["admin@example.com"]),
    ).toBe(false);
    expect(isAdminUser({ app_metadata: { role: "Admin" } })).toBe(false);
    expect(isAdminUser({ app_metadata: { role: "admin " } })).toBe(false);
    expect(isAdminUser({ email: null, app_metadata: { role: "editor" } })).toBe(
      false,
    );
  });
});
