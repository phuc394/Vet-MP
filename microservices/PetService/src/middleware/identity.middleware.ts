import { NextFunction, Request, Response } from "express";

export type IdentityRole = "admin" | "customer";

export interface IdentityUser {
  user_id: number;
  role: IdentityRole;
}

function normalizeRole(role: string): IdentityRole | null {
  if (role === "user") return "customer";
  if (role === "admin" || role === "customer") return role;
  return null;
}

const identityMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = Number(req.headers["x-user-id"]);
  const role = normalizeRole(String(req.headers["x-user-role"] ?? ""));

  if (!Number.isInteger(userId) || !role) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  (req as any).user = {
    user_id: userId,
    role,
  };

  next();
};

export { identityMiddleware };
