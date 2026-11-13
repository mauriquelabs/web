import path from "path";
import { createServer } from "./index";
import { serveSpa } from "./serveSpa";

const app = createServer();
const port = process.env.PORT || 5000;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

serveSpa(app, distPath);

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server running on 0.0.0.0:${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
