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

describe("handleContact", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("rejects a submission that is missing a required field", async () => {
    const req = {
      body: { name: "Ada", email: "ada@example.com" },
    } as Request;
    const res = createMockResponse();

    await handleContact(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Missing required fields",
    });
  });

  it("rejects an invalid email after required fields are present", async () => {
    const req = {
      body: { name: "Ada", email: "not-an-email", message: "Hello" },
    } as Request;
    const res = createMockResponse();

    await handleContact(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid email address",
    });
  });

  it("accepts a complete submission", async () => {
    vi.useFakeTimers();

    const req = {
      body: {
        name: "Ada",
        email: "ada@example.com",
        message: "Let's build something.",
      },
    } as Request;
    const res = createMockResponse();

    const pending = handleContact(req, res, vi.fn());
    await vi.runAllTimersAsync();
    await pending;

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Thank you for your message. We'll be in touch soon!",
    });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 500 when the body cannot be read", async () => {
    const req = { body: null } as unknown as Request;
    const res = createMockResponse();

    await handleContact(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  });
});
