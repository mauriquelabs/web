import { describe, expect, it, vi } from "vitest";
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
  it("returns 401 when no authenticated user is attached", () => {
    const res = createMockResponse();

    handleAuthMe({} as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("returns only the user id and email", () => {
    const res = createMockResponse();
    const req = {
      authUser: {
        id: "user-1",
        email: "admin@example.com",
        phone: "+15555550100",
        app_metadata: { role: "admin" },
        user_metadata: { full_name: "Ada" },
      },
    } as unknown as Request;

    handleAuthMe(req, res, vi.fn());

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: "user-1",
        email: "admin@example.com",
      },
    });
  });
});
