import { createServer as createHttpServer, type Server } from "node:http";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import handler from "./vercel-handler";

describe("vercel request handler", () => {
  it("exports a plain Node handler instead of the Express app", () => {
    expect(typeof handler).toBe("function");
    expect(handler).toHaveLength(2);
    expect(handler).not.toHaveProperty("listen");
    expect(handler).not.toHaveProperty("use");
    expect(typeof (handler as { then?: unknown }).then).not.toBe("function");
  });
});

describe("API routes through the Vercel handler", () => {
  let server: Server;
  let baseUrl: string;
  const originalPingMessage = process.env.PING_MESSAGE;

  beforeAll(async () => {
    server = createHttpServer(handler);
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", () => resolve());
    });

    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Expected the test server to listen on a TCP port");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    if (originalPingMessage === undefined) {
      delete process.env.PING_MESSAGE;
    } else {
      process.env.PING_MESSAGE = originalPingMessage;
    }

    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function postJson(path: string, body: unknown) {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return {
      status: response.status,
      body: (await response.json()) as { success?: boolean; message?: string },
    };
  }

  it("returns the configured ping message", async () => {
    process.env.PING_MESSAGE = "pong";

    const response = await fetch(`${baseUrl}/api/ping`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "pong" });
  });

  it("falls back to ping when PING_MESSAGE is unset", async () => {
    delete process.env.PING_MESSAGE;

    const response = await fetch(`${baseUrl}/api/ping`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "ping" });
  });

  it("rejects contact submissions that omit a required field", async () => {
    const response = await postJson("/api/contact", {
      name: "Ada",
      email: "ada@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Missing required fields",
    });
  });

  it("rejects contact submissions with an invalid email", async () => {
    const response = await postJson("/api/contact", {
      name: "Ada",
      email: "not-an-email",
      message: "Hello",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Invalid email address",
    });
  });

  it("rejects a non-string contact email instead of failing the request", async () => {
    const response = await postJson("/api/contact", {
      name: "Ada",
      email: 42,
      message: "Hello",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Invalid email address",
    });
  });

  it("returns a JSON error when the contact body is missing", async () => {
    const response = await fetch(`${baseUrl}/api/contact`, { method: "POST" });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  });

  it("accepts a complete contact submission", async () => {
    const response = await postJson("/api/contact", {
      name: "Ada",
      email: "ada@example.com",
      message: "We want to host a workshop.",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Thank you for your message. We'll be in touch soon!",
    });
  });

  it("rejects quote requests that omit a required field", async () => {
    const response = await postJson("/api/quote", {
      name: "Ada",
      email: "ada@example.com",
      serviceType: "workshop",
      description: "A one-day lab",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Missing required fields",
    });
  });

  it("rejects quote requests with an invalid email", async () => {
    const response = await postJson("/api/quote", {
      name: "Ada",
      email: "ada@example",
      serviceType: "workshop",
      description: "A one-day lab",
      budgetRange: "5-10k",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Invalid email address",
    });
  });

  it("accepts a complete quote request", async () => {
    const response = await postJson("/api/quote", {
      name: "Ada",
      email: "ada@example.com",
      serviceType: "workshop",
      description: "A one-day lab",
      budgetRange: "5-10k",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message:
        "Thank you for your quote request. We'll get back to you within 48 hours!",
    });
  });

  it("requires an authorization header on /api/auth/me", async () => {
    const response = await fetch(`${baseUrl}/api/auth/me`);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Missing or invalid authorization header",
    });
  });

  it("rejects authorization schemes other than Bearer", async () => {
    const response = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: "bearer secret-token" },
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Missing or invalid authorization header",
    });
  });
});
