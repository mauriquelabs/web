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

  return res as unknown as Response & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
}

describe("handleAuthMe", () => {
  it("returns 401 when the request has no authenticated user", () => {
    const req = {} as Request;
    const res = createMockResponse();

    handleAuthMe(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("returns only the user id and email", () => {
    const req = {
      authUser: {
        id: "user-1",
        email: "admin@example.com",
        phone: "+10000000000",
        app_metadata: { role: "admin" },
        user_metadata: { secret: "nope" },
        identities: [{ provider: "email" }],
      },
    } as unknown as Request;
    const res = createMockResponse();

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
