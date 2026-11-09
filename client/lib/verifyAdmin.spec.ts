import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyAdminAccess } from "./verifyAdmin";

describe("verifyAdminAccess", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the admin user and sends the bearer token", async () => {
    const signal = new AbortController().signal;

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        user: { id: "admin-1", email: "admin@example.com" },
      }),
    } as Response);

    await expect(verifyAdminAccess("token-1", signal)).resolves.toEqual({
      ok: true,
      user: { id: "admin-1", email: "admin@example.com" },
    });

    expect(fetch).toHaveBeenCalledWith("/api/auth/me", {
      headers: { Authorization: "Bearer token-1" },
      signal,
    });
  });

  it("returns the server error when access is denied", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Admin access required" }),
    } as Response);

    await expect(verifyAdminAccess("token-1")).resolves.toEqual({
      ok: false,
      error: "Admin access required",
    });
  });

  it("falls back when the error body is not JSON", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error("not json");
      },
    } as Response);

    await expect(verifyAdminAccess("token-1")).resolves.toEqual({
      ok: false,
      error: "Admin access required",
    });
  });

  it("returns a generic error when the request fails", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network down"));

    await expect(verifyAdminAccess("token-1")).resolves.toEqual({
      ok: false,
      error: "Could not verify admin access",
    });
  });

  it("rethrows abort errors so cancelled checks stay cancellations", async () => {
    const abortError = new DOMException(
      "The operation was aborted",
      "AbortError",
    );
    vi.mocked(fetch).mockRejectedValue(abortError);

    await expect(verifyAdminAccess("token-1")).rejects.toBe(abortError);
  });
});
