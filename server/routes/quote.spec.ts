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

const completeQuote = {
  name: "Ada",
  email: "ada@example.com",
  serviceType: "workshop",
  description: "A one-day creative lab.",
  budgetRange: "5-10k",
};

describe("handleQuote", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("rejects a submission that is missing one required field", async () => {
    const { budgetRange: _budgetRange, ...partial } = completeQuote;
    const req = { body: partial } as Request;
    const res = createMockResponse();

    await handleQuote(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Missing required fields",
    });
  });

  it("rejects an email without a domain", async () => {
    const req = {
      body: { ...completeQuote, email: "ada@example" },
    } as Request;
    const res = createMockResponse();

    await handleQuote(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid email address",
    });
  });

  it("accepts a complete quote request", async () => {
    vi.useFakeTimers();

    const req = { body: completeQuote } as Request;
    const res = createMockResponse();

    const pending = handleQuote(req, res, vi.fn());
    await vi.runAllTimersAsync();
    await pending;

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message:
        "Thank you for your quote request. We'll get back to you within 48 hours!",
    });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 500 when the body cannot be read", async () => {
    const req = { body: null } as unknown as Request;
    const res = createMockResponse();

    await handleQuote(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  });
});
