import { afterEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { handleQuote } from "./quote";

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
  serviceType: "workshop",
  description: "A one-day lab for a local venue.",
  budgetRange: "5-10k",
};

describe("handleQuote", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each([
    "name",
    "email",
    "serviceType",
    "description",
    "budgetRange",
  ] as const)("rejects a submission missing %s", async (field) => {
    const res = createMockResponse();
    const body = { ...validBody, [field]: "" };

    await handleQuote({ body } as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Missing required fields",
    });
  });

  it("rejects an invalid email when every other field is present", async () => {
    const res = createMockResponse();

    await handleQuote(
      { body: { ...validBody, email: "not-an-email" } } as Request,
      res,
      vi.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid email address",
    });
  });

  it("accepts a complete quote request", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});
    const res = createMockResponse();

    const pending = handleQuote({ body: validBody } as Request, res, vi.fn());
    await vi.advanceTimersByTimeAsync(500);
    await pending;

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message:
        "Thank you for your quote request. We'll get back to you within 48 hours!",
    });
  });

  it("returns 500 when the request body cannot be read", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = createMockResponse();

    await handleQuote({ body: null } as unknown as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  });
});
