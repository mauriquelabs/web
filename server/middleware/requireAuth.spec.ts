import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { requireAdmin, requireAuth } from "./requireAuth";
import { getSupabaseAdmin } from "../lib/supabase";

vi.mock("../lib/supabase", () => ({
  getSupabaseAdmin: vi.fn(),
}));

function createMockResponse() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };

  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);

  return res as unknown as Response;
}

function createMockRequest(authorization?: string): Request {
  return {
    headers: authorization ? { authorization } : {},
  } as Request;
}

function mockGetUser(result: { user: unknown; error?: unknown } | Error) {
  const getUser =
    result instanceof Error
      ? vi.fn().mockRejectedValue(result)
      : vi.fn().mockResolvedValue({
          data: { user: result.user },
          error: result.error ?? null,
        });

  vi.mocked(getSupabaseAdmin).mockReturnValue({
    auth: { getUser },
  } as never);

  return getUser;
}

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.ADMIN_EMAILS;
  });

  it("returns 401 when the authorization header is missing", async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing or invalid authorization header",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when the token is invalid", async () => {
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: "Invalid token" },
        }),
      },
    } as never);

    const req = createMockRequest("Bearer invalid-token");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when the user is authenticated but not an admin", async () => {
    process.env.ADMIN_EMAILS = "admin@example.com";

    vi.mocked(getSupabaseAdmin).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "user-1",
              email: "other@example.com",
              app_metadata: {},
            },
          },
          error: null,
        }),
      },
    } as never);

    const req = createMockRequest("Bearer valid-token");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Admin access required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when the user is an admin via email allowlist", async () => {
    process.env.ADMIN_EMAILS = "admin@example.com";

    const adminUser = {
      id: "admin-1",
      email: "admin@example.com",
      app_metadata: {},
    };

    const getUser = mockGetUser({ user: adminUser });

    const req = createMockRequest("Bearer valid-token");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(getUser).toHaveBeenCalledWith("valid-token");
    expect(next).toHaveBeenCalledOnce();
    expect(req.authUser).toEqual(adminUser);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("calls next when the user is an admin via app metadata role", async () => {
    process.env.ADMIN_EMAILS = "someone-else@example.com";

    const adminUser = {
      id: "admin-2",
      email: "not-listed@example.com",
      app_metadata: { role: "admin" },
    };

    mockGetUser({ user: adminUser });

    const req = createMockRequest("Bearer valid-token");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.authUser).toEqual(adminUser);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 401 and does not call Supabase for a non-bearer scheme", async () => {
    const req = createMockRequest("Basic abc123");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(getSupabaseAdmin).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing or invalid authorization header",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when the bearer token is empty", async () => {
    const getUser = mockGetUser({ user: null });

    const req = createMockRequest("Bearer ");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(getUser).toHaveBeenCalledWith("");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
    expect(req.authUser).toBeUndefined();
  });

  it("returns 401 when Supabase returns a user alongside an error", async () => {
    mockGetUser({
      user: {
        id: "admin-1",
        email: "admin@example.com",
        app_metadata: { role: "admin" },
      },
      error: { message: "session expired" },
    });

    const req = createMockRequest("Bearer stale-token");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
    expect(req.authUser).toBeUndefined();
  });

  it("returns 500 when the auth service throws", async () => {
    mockGetUser(new Error("supabase down"));

    const req = createMockRequest("Bearer valid-token");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Authentication service unavailable",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("requireAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.ADMIN_EMAILS;
  });

  it("returns 401 when the authorization header is missing", async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing or invalid authorization header",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("lets an authenticated non-admin through", async () => {
    const user = {
      id: "user-1",
      email: "member@example.com",
      app_metadata: {},
    };

    mockGetUser({ user });

    const req = createMockRequest("Bearer member-token");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.authUser).toEqual(user);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 500 when the auth service throws", async () => {
    mockGetUser(new Error("supabase down"));

    const req = createMockRequest("Bearer valid-token");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Authentication service unavailable",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
