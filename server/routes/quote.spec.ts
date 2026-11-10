import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

function createRequest(body: unknown): Request {
  return { body } as Request;
}

const validQuote = {
  name: "Ada",
  email: "ada@example.com",
  serviceType: "web",
  description: "A site for the label",
  budgetRange: "700 € – 1.500 €",
};

describe("handleQuote", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

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
  ] as const)("returns 400 when %s is blank", async (field) => {
    const req = createRequest({ ...validQuote, [field]: "" });
    const res = createMockResponse();

    await handleQuote(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Missing required fields",
    });
  });

  it.each(["not-an-email", "ada@example", "ada @example.com"])(
    "returns 400 for invalid email %s",
    async (email) => {
      const req = createRequest({ ...validQuote, email });
      const res = createMockResponse();

      await handleQuote(req, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid email address",
      });
    },
  );

  it("accepts a complete quote request", async () => {
    const req = createRequest(validQuote);
    const res = createMockResponse();

    const pending = handleQuote(req, res, vi.fn());
    await vi.advanceTimersByTimeAsync(500);
    await pending;

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message:
        "Thank you for your quote request. We'll get back to you within 48 hours!",
    });
  });

  it.each([null, undefined])(
    "returns 500 when the body cannot be read (%s)",
    async (body) => {
      const req = createRequest(body);
      const res = createMockResponse();

      await handleQuote(req, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    },
  );
});
