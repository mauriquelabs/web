import http from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer } from "./index";

let server: http.Server;
let baseUrl: string;
const previousPing = process.env.PING_MESSAGE;

beforeAll(async () => {
  delete process.env.PING_MESSAGE;
  const app = createServer();
  server = http.createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  if (previousPing === undefined) {
    delete process.env.PING_MESSAGE;
  } else {
    process.env.PING_MESSAGE = previousPing;
  }

  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe("createServer routes", () => {
  it("returns the default ping message", async () => {
    delete process.env.PING_MESSAGE;

    const response = await fetch(`${baseUrl}/api/ping`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: "ping" });
  });

  it("returns the configured ping message", async () => {
    process.env.PING_MESSAGE = "pong";

    const response = await fetch(`${baseUrl}/api/ping`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: "pong" });
  });

  it("rejects an incomplete contact submission", async () => {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Ada", email: "ada@example.com" }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: "Missing required fields",
    });
  });

  it("rejects an incomplete quote request", async () => {
    const response = await fetch(`${baseUrl}/api/quote`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Ada",
        email: "ada@example.com",
        serviceType: "workshop",
        description: "A lab",
      }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: "Missing required fields",
    });
  });

  it("requires an admin bearer token on /api/auth/me", async () => {
    const response = await fetch(`${baseUrl}/api/auth/me`);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Missing or invalid authorization header",
    });
  });
});
