import type { NextFunction, Request, Response } from "express";
import type { User } from "@supabase/supabase-js";
import { isAdminUser, parseAdminEmails } from "../../shared/auth";
import { getSupabaseAdmin } from "../lib/supabase";

declare global {
  namespace Express {
    interface Request {
      authUser?: User;
    }
  }
}

function getServerAdminEmails(): readonly string[] {
  return parseAdminEmails(process.env.ADMIN_EMAILS);
}

async function authenticateRequest(req: Request): Promise<User | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length);
  const supabase = getSupabaseAdmin();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  try {
    const user = await authenticateRequest(req);

    if (!user) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    req.authUser = user;
    next();
  } catch {
    res.status(500).json({ error: "Authentication service unavailable" });
  }
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  try {
    const user = await authenticateRequest(req);

    if (!user) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    if (!isAdminUser(user, getServerAdminEmails())) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    req.authUser = user;
    next();
  } catch {
    res.status(500).json({ error: "Authentication service unavailable" });
  }
}
