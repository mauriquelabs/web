import http from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer } from "./index";

describe("API routes", () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = http.createServer(createServer());
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", () => resolve());
    });
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  async function postJson(path: string, body: unknown) {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    return {
      status: response.status,
      body: (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      },
    };
  }

  it("returns the configured ping message", async () => {
    const previous = process.env.PING_MESSAGE;
    process.env.PING_MESSAGE = "pong";

    try {
      const response = await fetch(`${baseUrl}/api/ping`);
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ message: "pong" });
    } finally {
      if (previous === undefined) {
        delete process.env.PING_MESSAGE;
      } else {
        process.env.PING_MESSAGE = previous;
      }
    }
  });

  it("falls back to ping when PING_MESSAGE is unset", async () => {
    const previous = process.env.PING_MESSAGE;
    delete process.env.PING_MESSAGE;

    try {
      const response = await fetch(`${baseUrl}/api/ping`);
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ message: "ping" });
    } finally {
      if (previous !== undefined) {
        process.env.PING_MESSAGE = previous;
      }
    }
  });

  it("rejects unauthenticated admin session checks", async () => {
    const response = await fetch(`${baseUrl}/api/auth/me`);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Missing or invalid authorization header",
    });
  });

  it("rejects a non-bearer scheme on the admin session route", async () => {
    const response = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { authorization: "Basic abc123" },
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Missing or invalid authorization header",
    });
  });

  it("rejects a contact submission with missing fields", async () => {
    const result = await postJson("/api/contact", {
      name: "Ada",
      email: "ada@example.com",
    });

    expect(result).toEqual({
      status: 400,
      body: { success: false, message: "Missing required fields" },
    });
  });

  it("rejects a contact submission with an invalid email", async () => {
    const result = await postJson("/api/contact", {
      name: "Ada",
      email: "ada @example.com",
      message: "Hello",
    });

    expect(result).toEqual({
      status: 400,
      body: { success: false, message: "Invalid email address" },
    });
  });

  it("rejects a non-object contact body before the handler runs", async () => {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "null",
    });

    expect(response.status).toBe(400);
    await response.text();

    const ping = await fetch(`${baseUrl}/api/ping`);
    expect(ping.status).toBe(200);
  });

  it("rejects a quote request that is missing a required field", async () => {
    const result = await postJson("/api/quote", {
      name: "Ada",
      email: "ada@example.com",
      serviceType: "workshop",
      description: "A one-day creative lab.",
    });

    expect(result).toEqual({
      status: 400,
      body: { success: false, message: "Missing required fields" },
    });
  });

  it("rejects a quote request with an invalid email", async () => {
    const result = await postJson("/api/quote", {
      name: "Ada",
      email: "ada@example",
      serviceType: "workshop",
      description: "A one-day creative lab.",
      budgetRange: "5-10k",
    });

    expect(result).toEqual({
      status: 400,
      body: { success: false, message: "Invalid email address" },
    });
  });
});
