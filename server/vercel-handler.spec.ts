import http from "node:http";
import type { AddressInfo } from "node:net";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createServer } from "./index";
import { getSupabaseAdmin } from "./lib/supabase";
import handler from "./vercel-handler";

vi.mock("./lib/supabase", () => ({
  getSupabaseAdmin: vi.fn(),
}));

/**
 * Express 5 application objects have been thenable. Exporting one as the
 * Vercel function makes the runtime await the app instead of invoking it,
 * which is the preview/API failure fixed by the plain handler wrapper.
 */
function isExpressApp(value: unknown): boolean {
  return (
    typeof value === "function" &&
    "listen" in value &&
    "handle" in value &&
    "use" in value
  );
}

function dispatch(
  path: string,
  headers: Record<string, string> = {},
): Promise<{ status: number; body: unknown; returned: unknown }> {
  return new Promise((resolve, reject) => {
    let returned: unknown;

    const server = http.createServer((req, res) => {
      returned = handler(req, res);
    });

    server.listen(0, "127.0.0.1", () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Test server did not bind to a TCP port"));
        return;
      }

      const req = http.request(
        {
          hostname: "127.0.0.1",
          port: (address as AddressInfo).port,
          path,
          method: "GET",
          headers: { connection: "close", ...headers },
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (chunk: Buffer) => chunks.push(chunk));
          res.on("end", () => {
            const raw = Buffer.concat(chunks).toString("utf8");
            let body: unknown = raw;
            try {
              body = JSON.parse(raw);
            } catch {
              body = raw;
            }

            server.close(() => {
              resolve({ status: res.statusCode ?? 0, body, returned });
            });
          });
        },
      );

      req.on("error", (error) => {
        server.close(() => reject(error));
      });
      req.end();
    });
  });
}

describe("vercel handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.ADMIN_EMAILS;
    delete process.env.PING_MESSAGE;
  });

  it("exports a plain request function instead of the Express app", () => {
    expect(typeof handler).toBe("function");
    expect(isExpressApp(handler)).toBe(false);
    expect(isExpressApp(createServer())).toBe(true);
    expect("then" in handler).toBe(false);
  });

  it("serves /api/ping without returning the app invocation", async () => {
    process.env.PING_MESSAGE = "pong";

    const response = await dispatch("/api/ping");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "pong" });
    expect(response.returned).toBeUndefined();
  });

  it("rejects /api/auth/me when no bearer token is sent", async () => {
    const response = await dispatch("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "Missing or invalid authorization header",
    });
    expect(getSupabaseAdmin).not.toHaveBeenCalled();
  });

  it("rejects authenticated users who are not admins", async () => {
    process.env.ADMIN_EMAILS = "admin@example.com";
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "user-1",
              email: "member@example.com",
              app_metadata: { role: "editor" },
              identities: [{ provider: "email", identity_id: "secret" }],
            },
          },
          error: null,
        }),
      },
    } as never);

    const response = await dispatch("/api/auth/me", {
      authorization: "Bearer member-token",
    });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: "Admin access required" });
  });

  it("returns only id and email for an allowlisted admin", async () => {
    process.env.ADMIN_EMAILS = "admin@example.com";
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "admin-1",
              email: "admin@example.com",
              app_metadata: { provider: "email" },
              identities: [{ provider: "email", identity_id: "secret" }],
            },
          },
          error: null,
        }),
      },
    } as never);

    const response = await dispatch("/api/auth/me", {
      authorization: "Bearer admin-token",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: { id: "admin-1", email: "admin@example.com" },
    });
  });
});
