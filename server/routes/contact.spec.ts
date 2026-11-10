import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

function createRequest(body: unknown): Request {
  return { body } as Request;
}

describe("handleContact", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each(["name", "email", "message"] as const)(
    "returns 400 when %s is blank",
    async (field) => {
      const req = createRequest({
        name: "Ada",
        email: "ada@example.com",
        message: "Hello",
        [field]: "",
      });
      const res = createMockResponse();

      await handleContact(req, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Missing required fields",
      });
    },
  );

  it.each(["not-an-email", "ada@example", "ada @example.com"])(
    "returns 400 for invalid email %s",
    async (email) => {
      const req = createRequest({
        name: "Ada",
        email,
        message: "Hello",
      });
      const res = createMockResponse();

      await handleContact(req, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid email address",
      });
    },
  );

  it("accepts a complete submission", async () => {
    const req = createRequest({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello",
    });
    const res = createMockResponse();

    const pending = handleContact(req, res, vi.fn());
    await vi.advanceTimersByTimeAsync(500);
    await pending;

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Thank you for your message. We'll be in touch soon!",
    });
  });

  it.each([null, undefined])(
    "returns 500 when the body cannot be read (%s)",
    async (body) => {
      const req = createRequest(body);
      const res = createMockResponse();

      await handleContact(req, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    },
  );
});
