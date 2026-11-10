import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IncomingMessage, ServerResponse } from "node:http";
import handler from "./vercel-handler";
import { createServer } from "./index";

vi.mock("./index", () => ({
  createServer: vi.fn(() => vi.fn(() => Promise.resolve("express"))),
}));

describe("vercel handler", () => {
  const app = vi.mocked(createServer).mock.results[0]?.value as ReturnType<
    typeof vi.fn
  >;

  beforeEach(() => {
    app.mockClear();
  });

  it("forwards the request to Express and does not return its promise", () => {
    const req = { url: "/api/ping" } as IncomingMessage;
    const res = {} as ServerResponse;

    const result = handler(req, res);

    expect(createServer).toHaveBeenCalledOnce();
    expect(app).toHaveBeenCalledOnce();
    expect(app).toHaveBeenCalledWith(req, res);
    expect(result).toBeUndefined();
  });
});
