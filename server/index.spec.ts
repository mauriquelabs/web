import http from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { createServer } from "./index";

const app = createServer();

function request(
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number; json: unknown }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as AddressInfo;
      const payload = body === undefined ? undefined : JSON.stringify(body);
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port,
          path,
          method,
          headers: payload
            ? {
                "content-type": "application/json",
                "content-length": Buffer.byteLength(payload),
              }
            : undefined,
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (chunk) => chunks.push(chunk));
          res.on("end", () => {
            server.close();
            const raw = Buffer.concat(chunks).toString("utf8");
            resolve({
              status: res.statusCode ?? 0,
              json: raw ? JSON.parse(raw) : null,
            });
          });
        },
      );

      req.on("error", (error) => {
        server.close();
        reject(error);
      });

      if (payload) {
        req.write(payload);
      }
      req.end();
    });
  });
}

describe("createServer", () => {
  const previousPing = process.env.PING_MESSAGE;

  afterEach(() => {
    if (previousPing === undefined) {
      delete process.env.PING_MESSAGE;
    } else {
      process.env.PING_MESSAGE = previousPing;
    }
  });

  it("returns the default ping message", async () => {
    delete process.env.PING_MESSAGE;

    const response = await request("GET", "/api/ping");

    expect(response.status).toBe(200);
    expect(response.json).toEqual({ message: "ping" });
  });

  it("returns the configured ping message", async () => {
    process.env.PING_MESSAGE = "pong";

    const response = await request("GET", "/api/ping");

    expect(response.status).toBe(200);
    expect(response.json).toEqual({ message: "pong" });
  });

  it("serves the demo route", async () => {
    const response = await request("GET", "/api/demo");

    expect(response.status).toBe(200);
    expect(response.json).toEqual({ message: "Hello from Express server" });
  });

  it("rejects an incomplete contact submission before the handler delay", async () => {
    const response = await request("POST", "/api/contact", {
      name: "Ada",
      email: "ada@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.json).toEqual({
      success: false,
      message: "Missing required fields",
    });
  });

  it("rejects a quote request with an invalid email", async () => {
    const response = await request("POST", "/api/quote", {
      name: "Ada",
      email: "not-an-email",
      serviceType: "web",
      description: "A site for the label",
      budgetRange: "700 € – 1.500 €",
    });

    expect(response.status).toBe(400);
    expect(response.json).toEqual({
      success: false,
      message: "Invalid email address",
    });
  });
});
