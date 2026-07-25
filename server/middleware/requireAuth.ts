import type { NextFunction, Request, Response } from "express";
import type { User } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "../lib/supabase";

declare global {
  namespace Express {
    interface Request {
      authUser?: User;
    }
  }
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

  const token = authHeader.slice("Bearer ".length);

  try {
    const supabase = getSupabaseAdmin();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    req.authUser = user;
    next();
  } catch {
    res.status(500).json({ error: "Authentication service unavailable" });
  }
}
