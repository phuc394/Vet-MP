import {
  NextFunction,
  Request,
  Response,
} from "express";

function normalizeRole(role: string) {
  return role === "user" ? "customer" : role;
}

const authorizeRoles = (...roles: string[]) => {
  const allowedRoles = roles.map(normalizeRole);

  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (
        !allowedRoles.includes(
          normalizeRole(user.role)
        )
      ) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Authorization error",
      });
    }
  };
};

export default authorizeRoles;
