import { createServer as createHttpServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import handler from "./vercel-handler";

describe("vercel handler", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createHttpServer(handler);
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", () => {
        const address = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (!server?.listening) {
      return;
    }

    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("exports a plain request function rather than the Express app", () => {
    expect(typeof handler).toBe("function");
    expect(handler).not.toHaveProperty("use");
    expect(handler).not.toHaveProperty("listen");
    expect(typeof (handler as { then?: unknown }).then).not.toBe("function");
  });

  it("forwards API requests to the Express app", async () => {
    const previousPing = process.env.PING_MESSAGE;
    process.env.PING_MESSAGE = "coverage-ping";

    try {
      const ping = await fetch(`${baseUrl}/api/ping`);
      expect(ping.status).toBe(200);
      expect(await ping.json()).toEqual({ message: "coverage-ping" });

      const me = await fetch(`${baseUrl}/api/auth/me`);
      expect(me.status).toBe(401);
      expect(await me.json()).toEqual({
        error: "Missing or invalid authorization header",
      });

      const missing = await fetch(`${baseUrl}/api/not-a-route`);
      expect(missing.status).toBe(404);
      await missing.text();
    } finally {
      if (previousPing === undefined) {
        delete process.env.PING_MESSAGE;
      } else {
        process.env.PING_MESSAGE = previousPing;
      }
    }
  });
});
