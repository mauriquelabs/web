import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");

interface VercelRewrite {
  source: string;
  destination: string;
}

interface VercelConfig {
  buildCommand: string;
  outputDirectory: string;
  functions: Record<string, { includeFiles?: string }>;
  rewrites: VercelRewrite[];
}

const vercel = JSON.parse(
  readFileSync(path.join(root, "vercel.json"), "utf8"),
) as VercelConfig;

describe("vercel publish config", () => {
  it("publishes the Vite SPA directory and bundles the API function", () => {
    expect(vercel.outputDirectory).toBe("dist/spa");
    expect(vercel.buildCommand).toContain("build:client");
    expect(vercel.buildCommand).toContain("build:api");
    expect(vercel.functions["api/index.js"]?.includeFiles).toBe("dist/api/**");
  });

  it("routes nested /api requests to Express before the SPA fallback", () => {
    const apiRule = vercel.rewrites.find((rule) => rule.destination === "/api");
    const spaRule = vercel.rewrites.find(
      (rule) => rule.destination === "/index.html",
    );

    expect(apiRule).toEqual({ source: "/api/(.*)", destination: "/api" });
    expect(spaRule).toEqual({
      source: "/(.*)",
      destination: "/index.html",
    });
    expect(vercel.rewrites.indexOf(apiRule!)).toBeLessThan(
      vercel.rewrites.indexOf(spaRule!),
    );
  });

  it("loads the compiled handler instead of TypeScript at runtime", () => {
    const apiEntry = readFileSync(path.join(root, "api/index.js"), "utf8");
    const apiBuild = readFileSync(
      path.join(root, "vite.config.api.ts"),
      "utf8",
    );

    expect(apiEntry).toContain('from "../dist/api/handler.mjs"');
    expect(apiBuild).toContain("server/vercel-handler.ts");
    expect(apiBuild).toContain('outDir: "dist/api"');
    expect(apiBuild).toContain('entryFileNames: "handler.mjs"');
  });
});
