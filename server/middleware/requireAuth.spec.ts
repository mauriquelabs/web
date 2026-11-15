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

function mockGetUser(
  result:
    | {
        user: {
          id: string;
          email?: string;
          app_metadata?: Record<string, unknown>;
        } | null;
        error?: { message: string } | null;
      }
    | { reject: unknown },
) {
  const getUser =
    "reject" in result
      ? vi.fn().mockRejectedValue(result.reject)
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

    vi.mocked(getSupabaseAdmin).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: adminUser },
          error: null,
        }),
      },
    } as never);

    const req = createMockRequest("Bearer valid-token");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.authUser).toEqual(adminUser);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("calls next when the user has the admin role and is not on the allowlist", async () => {
    const getUser = mockGetUser({
      user: {
        id: "admin-2",
        email: "other@example.com",
        app_metadata: { role: "admin" },
      },
    });

    const req = createMockRequest("Bearer signed-jwt");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(getUser).toHaveBeenCalledWith("signed-jwt");
    expect(next).toHaveBeenCalledOnce();
    expect(req.authUser).toMatchObject({ id: "admin-2" });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("matches a later allowlist entry after normalizing case and whitespace", async () => {
    process.env.ADMIN_EMAILS = " first@example.com, Admin@Example.com ";

    mockGetUser({
      user: {
        id: "admin-3",
        email: "admin@example.com",
        app_metadata: {},
      },
    });

    const req = createMockRequest("Bearer signed-jwt");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 401 for a non-bearer authorization scheme", async () => {
    const req = createMockRequest("Basic dXNlcjpwYXNz");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing or invalid authorization header",
    });
    expect(getSupabaseAdmin).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when token verification reports an error alongside a user", async () => {
    mockGetUser({
      user: {
        id: "admin-1",
        email: "admin@example.com",
        app_metadata: { role: "admin" },
      },
      error: { message: "invalid" },
    });

    const req = createMockRequest("Bearer signed-jwt");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 500 when token verification rejects", async () => {
    mockGetUser({ reject: new Error("supabase down") });

    const req = createMockRequest("Bearer signed-jwt");
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

  it("returns 401 when the token is invalid", async () => {
    mockGetUser({
      user: null,
      error: { message: "Invalid token" },
    });

    const req = createMockRequest("Bearer invalid-token");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next for an authenticated user who is not an admin", async () => {
    const member = {
      id: "user-1",
      email: "member@example.com",
      app_metadata: { role: "editor" },
    };
    const getUser = mockGetUser({ user: member });
    process.env.ADMIN_EMAILS = "admin@example.com";

    const req = createMockRequest("Bearer member-jwt");
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await requireAuth(req, res, next);

    expect(getUser).toHaveBeenCalledWith("member-jwt");
    expect(next).toHaveBeenCalledOnce();
    expect(req.authUser).toEqual(member);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 500 when token verification rejects", async () => {
    mockGetUser({ reject: new Error("network") });

    const req = createMockRequest("Bearer signed-jwt");
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
