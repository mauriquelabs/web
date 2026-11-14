import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyAdminAccess } from "./verifyAdmin";

describe("verifyAdminAccess", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the user when the server confirms admin access", async () => {
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

  it("returns the server error when access is denied", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Admin access required" }),
      }),
    );

    await expect(verifyAdminAccess("token")).resolves.toEqual({
      ok: false,
      error: "Admin access required",
    });
  });

  it("uses a fallback error when the denial body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error("not json");
        },
      }),
    );

    await expect(verifyAdminAccess("token")).resolves.toEqual({
      ok: false,
      error: "Admin access required",
    });
  });

  it("returns a network error when verification cannot be completed", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(verifyAdminAccess("token")).resolves.toEqual({
      ok: false,
      error: "Could not verify admin access",
    });
  });

  it("rethrows abort errors so cancelled checks do not look like denials", async () => {
    const abortError = new DOMException(
      "The operation was aborted",
      "AbortError",
    );
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(abortError));

    await expect(verifyAdminAccess("token")).rejects.toBe(abortError);
  });

  it("treats other DOM exceptions as a failed verification", async () => {
    const timeout = new DOMException("timed out", "TimeoutError");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(timeout));

    await expect(verifyAdminAccess("token")).resolves.toEqual({
      ok: false,
      error: "Could not verify admin access",
    });
  });
});
