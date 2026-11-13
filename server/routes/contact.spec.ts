import { afterEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { handleContact } from "./contact";

function createMockResponse() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };

  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);

  return res as unknown as Response;
}

const validBody = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "We want to host a workshop.",
};

describe("handleContact", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each([
    { email: validBody.email, message: validBody.message },
    { name: validBody.name, message: validBody.message },
    { name: validBody.name, email: validBody.email },
    { name: "", email: validBody.email, message: validBody.message },
  ])("rejects an incomplete submission %#", async (body) => {
    const res = createMockResponse();

    await handleContact({ body } as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Missing required fields",
    });
  });

  it.each(["plain", "ada@", "@example.com", "ada@example", "ada @example.com"])(
    "rejects invalid email %s",
    async (email) => {
      const res = createMockResponse();

      await handleContact(
        { body: { ...validBody, email } } as Request,
        res,
        vi.fn(),
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid email address",
      });
    },
  );

  it("accepts a complete submission", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});
    const res = createMockResponse();

    const pending = handleContact({ body: validBody } as Request, res, vi.fn());
    await vi.advanceTimersByTimeAsync(500);
    await pending;

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Thank you for your message. We'll be in touch soon!",
    });
  });

  it("returns 500 when the request body cannot be read", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = createMockResponse();

    await handleContact({ body: null } as unknown as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  });
});
