import { NextFunction, Request, Response } from "express";

const roleAliases: Record<string, string> = {
  user: "customer",
};

function normalizeRole(role: string) {
  return roleAliases[role] ?? role;
}

const authorizeRoles = (...roles: string[]) => {
  const allowedRoles = roles.map(normalizeRole);

  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!allowedRoles.includes(normalizeRole(user.role))) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
};

export { authorizeRoles };
