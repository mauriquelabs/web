import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleContact } from "./routes/contact";
import { handleQuote } from "./routes/quote";
import { handleAuthMe } from "./routes/auth";
import { requireAuth } from "./middleware/requireAuth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Contact form endpoint
  app.post("/api/contact", handleContact);

  // Quote request endpoint
  app.post("/api/quote", handleQuote);

  // Auth — verify Supabase JWT for protected CMS routes
  app.get("/api/auth/me", requireAuth, handleAuthMe);

  return app;
}
