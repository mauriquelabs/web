import type { IncomingMessage, ServerResponse } from "node:http";
import type { Express } from "express";

let appPromise: Promise<Express> | undefined;

async function loadApp(): Promise<Express> {
  const { createServer } = await import("../server/index");
  return createServer();
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    appPromise ??= loadApp();
    const app = await appPromise;
    app(req, res);
  } catch (error) {
    const message =
      error instanceof Error ? (error.stack ?? error.message) : String(error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "text/plain; charset=utf-8");
    }
    res.end(message);
  }
}
