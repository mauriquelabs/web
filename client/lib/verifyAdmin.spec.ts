import { describe, it, expect, vi, afterEach } from "vitest";
import { verifyAdminAccess } from "./verifyAdmin";

describe("verifyAdminAccess", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns the authenticated user and forwards the bearer token", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        user: { id: "admin-1", email: "admin@example.com" },
        error: "should-not-surface",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const signal = new AbortController().signal;

    const result = await verifyAdminAccess("token-1", signal);

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/me", {
      headers: { Authorization: "Bearer token-1" },
      signal,
    });
    expect(result).toEqual({
      ok: true,
      user: { id: "admin-1", email: "admin@example.com" },
    });
  });

  it("passes through the server error when access is denied", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Invalid or expired token" }),
      }),
    );

    await expect(verifyAdminAccess("token-1")).resolves.toEqual({
      ok: false,
      error: "Invalid or expired token",
    });
  });

  it("uses a fallback error when a denied response has no JSON body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error("invalid json");
        },
      }),
    );

    await expect(verifyAdminAccess("token-1")).resolves.toEqual({
      ok: false,
      error: "Admin access required",
    });
  });

  it("returns a generic error when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("network down")),
    );

    await expect(verifyAdminAccess("token-1")).resolves.toEqual({
      ok: false,
      error: "Could not verify admin access",
    });
  });

  it("rethrows abort errors so callers can ignore cancelled checks", async () => {
    const abortError = new DOMException(
      "The operation was aborted",
      "AbortError",
    );
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(abortError));

    await expect(verifyAdminAccess("token-1")).rejects.toBe(abortError);
  });

  it("rethrows abort errors raised while reading a successful body", async () => {
    const abortError = new DOMException(
      "The operation was aborted",
      "AbortError",
    );
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw abortError;
        },
      }),
    );

    await expect(verifyAdminAccess("token-1")).rejects.toBe(abortError);
  });
});
