import {
  NextFunction,
  Request,
  Response,
} from "express";

export interface AuthRequest extends Request {
  user?: {
    user_id: number;
    role: string;
  };
}

function normalizeRole(role: string) {
  return role === "user" ? "customer" : role;
}

const identityMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = Number(req.headers["x-user-id"]);
  const role = normalizeRole(
    String(req.headers["x-user-role"] ?? "")
  );

  if (
    !Number.isInteger(userId) ||
    !["admin", "customer"].includes(role)
  ) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  req.user = {
    user_id: userId,
    role,
  };

  next();
};

export default identityMiddleware;
