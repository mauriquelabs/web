export interface AuthUser {
  id: string;
  email: string | undefined;
}

export interface AuthMeResponse {
  user: AuthUser;
}

export interface AuthErrorResponse {
  error: string;
}

export interface AdminUserLike {
  email?: string | null;
  app_metadata?: Record<string, unknown>;
}

export function parseAdminEmails(raw?: string): readonly string[] {
  return (raw ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(
  user: AdminUserLike,
  allowedEmails: readonly string[] = [],
): boolean {
  if (user.app_metadata?.role === "admin") {
    return true;
  }

  const email = user.email?.trim().toLowerCase();
  return Boolean(email && allowedEmails.includes(email));
}
