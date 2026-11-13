import path from "path";
import express, { type Express } from "express";

export function serveSpa(app: Express, distPath: string) {
  app.use(express.static(distPath));

  // Handle React Router - serve index.html for all non-API routes
  app.get("/{*path}", (req, res) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }

    res.sendFile(path.join(distPath, "index.html"));
  });
}
