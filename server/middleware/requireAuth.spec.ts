import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { requireAdmin } from "./requireAuth";
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
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid or expired token" });
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
});
