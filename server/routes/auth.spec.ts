import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { handleAuthMe } from "./auth";

function createMockResponse() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };

  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);

  return res as unknown as Response;
}

describe("handleAuthMe", () => {
  it("returns 401 when the request has no authenticated user", () => {
    const req = {} as Request;
    const res = createMockResponse();

    handleAuthMe(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("returns only id and email from the authenticated user", () => {
    const req = {
      authUser: {
        id: "user-1",
        email: "admin@example.com",
        app_metadata: { role: "admin" },
        aud: "authenticated",
      },
    } as unknown as Request;
    const res = createMockResponse();

    handleAuthMe(req, res, vi.fn());

    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: "user-1",
        email: "admin@example.com",
      },
    });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("preserves a missing email instead of inventing one", () => {
    const req = {
      authUser: {
        id: "user-2",
        email: undefined,
      },
    } as unknown as Request;
    const res = createMockResponse();

    handleAuthMe(req, res, vi.fn());

    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: "user-2",
        email: undefined,
      },
    });
  });
});
