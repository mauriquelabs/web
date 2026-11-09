import type { IncomingMessage, ServerResponse } from "node:http";
import { createServer } from "../server/index.js";

const app = createServer();

export default function handler(req: IncomingMessage, res: ServerResponse) {
  app(req, res);
}
