import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyAdminAccess } from "./verifyAdmin";

afterEach(() => {
  vi.unstubAllGlobals();
});

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("verifyAdminAccess", () => {
  it("returns the signed-in user when /api/auth/me accepts the token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        user: { id: "admin-1", email: "admin@example.com" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const signal = new AbortController().signal;
    const result = await verifyAdminAccess("admin-token", signal);

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/me", {
      headers: { Authorization: "Bearer admin-token" },
      signal,
    });
    expect(result).toEqual({
      ok: true,
      user: { id: "admin-1", email: "admin@example.com" },
    });
  });

  it("uses the server error message when access is denied", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse(403, { error: "Admin access required" }),
        ),
    );

    await expect(verifyAdminAccess("member-token")).resolves.toEqual({
      ok: false,
      error: "Admin access required",
    });
  });

  it("falls back when a failed response has no JSON error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("upstream down", { status: 502 })),
    );

    await expect(verifyAdminAccess("admin-token")).resolves.toEqual({
      ok: false,
      error: "Admin access required",
    });
  });

  it("reports a verification failure when the request cannot be sent", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("fetch failed")),
    );

    await expect(verifyAdminAccess("admin-token")).resolves.toEqual({
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
          new DOMException("The operation was aborted", "AbortError"),
        ),
    );

    await expect(verifyAdminAccess("admin-token")).rejects.toMatchObject({
      name: "AbortError",
    });
  });
});
