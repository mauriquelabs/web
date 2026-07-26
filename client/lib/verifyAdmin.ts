import type { AuthMeResponse } from "@shared/auth";

export type VerifyAdminResult =
  | { ok: true; user: AuthMeResponse["user"] }
  | { ok: false; error: string };

export async function verifyAdminAccess(
  accessToken: string,
  signal?: AbortSignal,
): Promise<VerifyAdminResult> {
  try {
    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal,
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      return {
        ok: false,
        error: body?.error ?? "Admin access required",
      };
    }

    const data = (await response.json()) as AuthMeResponse;
    return { ok: true, user: data.user };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return { ok: false, error: "Could not verify admin access" };
  }
}
