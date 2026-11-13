import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer } from "./index";
import { serveSpa } from "./serveSpa";

let server: http.Server;
let baseUrl: string;
let distPath: string;

beforeAll(async () => {
  distPath = fs.mkdtempSync(path.join(os.tmpdir(), "maurique-spa-"));
  fs.mkdirSync(path.join(distPath, "assets"));
  fs.writeFileSync(
    path.join(distPath, "index.html"),
    "<!doctype html><title>Maurique Labs</title>",
  );
  fs.writeFileSync(
    path.join(distPath, "assets", "app.js"),
    "console.log('app');",
  );

  const app = createServer();
  serveSpa(app, distPath);
  server = http.createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  fs.rmSync(distPath, { recursive: true, force: true });
});

describe("serveSpa", () => {
  it("serves a built asset directly", async () => {
    const response = await fetch(`${baseUrl}/assets/app.js`);

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe("console.log('app');");
  });

  it("serves the SPA shell for a client route", async () => {
    const response = await fetch(`${baseUrl}/workshops`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    await expect(response.text()).resolves.toContain("Maurique Labs");
  });

  it("keeps unknown API paths as JSON 404s", async () => {
    const response = await fetch(`${baseUrl}/api/does-not-exist`);

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      error: "API endpoint not found",
    });
  });

  it("keeps health checks as JSON 404s", async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "API endpoint not found",
    });
  });

  it("still routes registered API endpoints through Express", async () => {
    const previousPing = process.env.PING_MESSAGE;
    delete process.env.PING_MESSAGE;

    try {
      const ping = await fetch(`${baseUrl}/api/ping`);
      expect(ping.status).toBe(200);
      await expect(ping.json()).resolves.toEqual({ message: "ping" });
    } finally {
      if (previousPing === undefined) {
        delete process.env.PING_MESSAGE;
      } else {
        process.env.PING_MESSAGE = previousPing;
      }
    }

    const contact = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "ada@example.com" }),
    });
    expect(contact.status).toBe(400);
    await expect(contact.json()).resolves.toEqual({
      success: false,
      message: "Missing required fields",
    });
  });
});
