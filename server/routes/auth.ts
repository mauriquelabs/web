import type { RequestHandler } from "express";
import type { AuthMeResponse } from "@shared/auth";

export const handleAuthMe: RequestHandler = (req, res) => {
  const user = req.authUser;

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const response: AuthMeResponse = {
    user: {
      id: user.id,
      email: user.email,
    },
  };

  res.json(response);
};
