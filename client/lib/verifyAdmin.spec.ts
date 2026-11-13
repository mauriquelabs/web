import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyAdminAccess } from "./verifyAdmin";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("verifyAdminAccess", () => {
  it("returns the user and sends the bearer token", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        user: { id: "user-1", email: "admin@example.com" },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const controller = new AbortController();

    await expect(
      verifyAdminAccess("token-1", controller.signal),
    ).resolves.toEqual({
      ok: true,
      user: { id: "user-1", email: "admin@example.com" },
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/me", {
      headers: { Authorization: "Bearer token-1" },
      signal: controller.signal,
    });
  });

  it("surfaces the server error when access is denied", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Admin access required" }),
      }),
    );

    await expect(verifyAdminAccess("token-1")).resolves.toEqual({
      ok: false,
      error: "Admin access required",
    });
  });

  it("uses a fallback error when the denial body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error("not json")),
      }),
    );

    await expect(verifyAdminAccess("token-1")).resolves.toEqual({
      ok: false,
      error: "Admin access required",
    });
  });

  it("returns a verification error when the request fails", async () => {
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
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockRejectedValue(
          new DOMException("The operation was aborted.", "AbortError"),
        ),
    );

    await expect(verifyAdminAccess("token-1")).rejects.toMatchObject({
      name: "AbortError",
    });
  });
});
