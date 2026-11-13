import { afterEach, describe, expect, it, vi } from "vitest";

const originalUrl = process.env.SUPABASE_URL;
const originalKey = process.env.SUPABASE_ANON_KEY;

async function loadGetSupabaseAdmin() {
  vi.resetModules();
  const { getSupabaseAdmin } = await import("./supabase");
  return getSupabaseAdmin;
}

afterEach(() => {
  if (originalUrl === undefined) {
    delete process.env.SUPABASE_URL;
  } else {
    process.env.SUPABASE_URL = originalUrl;
  }

  if (originalKey === undefined) {
    delete process.env.SUPABASE_ANON_KEY;
  } else {
    process.env.SUPABASE_ANON_KEY = originalKey;
  }

  vi.resetModules();
});

describe("getSupabaseAdmin", () => {
  it("throws when both credentials are missing", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;

    const getSupabaseAdmin = await loadGetSupabaseAdmin();

    expect(() => getSupabaseAdmin()).toThrow(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY",
    );
  });

  it("throws when only one credential is set", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "";

    const getSupabaseAdmin = await loadGetSupabaseAdmin();

    expect(() => getSupabaseAdmin()).toThrow(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY",
    );
  });
});
