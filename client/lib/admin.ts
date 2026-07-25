import { parseAdminEmails } from "@shared/auth";

export function getClientAdminEmails(): readonly string[] {
  return parseAdminEmails(import.meta.env.VITE_ADMIN_EMAILS);
}
