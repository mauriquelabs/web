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
  it("returns only the id and email of the authenticated user", () => {
    const req = {
      authUser: {
        id: "admin-1",
        email: "admin@example.com",
        phone: "+10000000000",
        app_metadata: { role: "admin" },
        user_metadata: { name: "Admin" },
        identities: [{ id: "identity-1" }],
      },
    } as Request;
    const res = createMockResponse();

    handleAuthMe(req, res, vi.fn());

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: "admin-1",
        email: "admin@example.com",
      },
    });
  });

  it("returns 401 when no authenticated user is present", () => {
    const req = {} as Request;
    const res = createMockResponse();

    handleAuthMe(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });
});
