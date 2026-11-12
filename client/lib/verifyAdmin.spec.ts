import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyAdminAccess } from "./verifyAdmin";

afterEach(() => {
  vi.unstubAllGlobals();
});

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("verifyAdminAccess", () => {
  it("returns the user when the server accepts the bearer token", async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        user: { id: "admin-1", email: "admin@example.com" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await verifyAdminAccess("access-token", controller.signal);

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/me", {
      headers: { Authorization: "Bearer access-token" },
      signal: controller.signal,
    });
    expect(result).toEqual({
      ok: true,
      user: { id: "admin-1", email: "admin@example.com" },
    });
  });

  it("returns the server error message when access is denied", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse(403, { error: "Admin access required" }),
        ),
    );

    await expect(verifyAdminAccess("access-token")).resolves.toEqual({
      ok: false,
      error: "Admin access required",
    });
  });

  it("uses a fallback message when the error body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("nope", { status: 502 })),
    );

    await expect(verifyAdminAccess("access-token")).resolves.toEqual({
      ok: false,
      error: "Admin access required",
    });
  });

  it("reports a verification failure when the request cannot be made", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );

    await expect(verifyAdminAccess("access-token")).resolves.toEqual({
      ok: false,
      error: "Could not verify admin access",
    });
  });

  it("rethrows abort errors so a cancelled check is not treated as denial", async () => {
    const abortError = new DOMException(
      "The operation was aborted",
      "AbortError",
    );
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(abortError));

    await expect(verifyAdminAccess("access-token")).rejects.toBe(abortError);
  });
});
