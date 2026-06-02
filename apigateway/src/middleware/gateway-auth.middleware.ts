import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface GatewayAuthRequest extends Request {
  user?: {
    user_id: number;
    role: string;
  };
}

const publicRoutes = [
  { method: "POST", path: "/api/v1/auth/register" },
  { method: "POST", path: "/api/v1/auth/login" },
  { method: "POST", path: "/api/v1/auth/refresh-token" },
  { method: "POST", path: "/api/v1/auth/forgot-password" },
  { method: "POST", path: "/api/v1/auth/reset-password" },
];

type RouteRule = {
  prefix: string;
  methods?: string[];
  roles: string[];
};

const routeRules: RouteRule[] = [
  { prefix: "/api/v1/staff", roles: ["admin"] },
  { prefix: "/api/v1/reports", roles: ["admin"] },
  { prefix: "/api/v1/suppliers", roles: ["admin"] },
  { prefix: "/api/v1/medicine-inventory", roles: ["admin"] },
  { prefix: "/api/v1/inventory-transactions", roles: ["admin"] },

  { prefix: "/api/v1/catalog", methods: ["GET"], roles: ["admin", "customer"] },
  { prefix: "/api/v1/catalog", roles: ["admin"] },

  { prefix: "/api/v1/pets", methods: ["GET"], roles: ["admin", "customer"] },
  { prefix: "/api/v1/pets", methods: ["POST", "PUT", "PATCH", "DELETE"], roles: ["admin", "customer"] },

  { prefix: "/api/v1/appointments", methods: ["GET"], roles: ["admin", "customer"] },
  { prefix: "/api/v1/appointments", methods: ["POST", "PUT", "PATCH"], roles: ["customer"] },
  { prefix: "/api/v1/appointments", methods: ["DELETE"], roles: ["admin"] },

  { prefix: "/api/v1/medical-records", methods: ["GET"], roles: ["admin", "customer"] },
  { prefix: "/api/v1/prescriptions", methods: ["GET"], roles: ["admin", "customer"] },
  { prefix: "/api/v1/re-examinations", methods: ["GET"], roles: ["admin", "customer"] },
  { prefix: "/api/v1/medical-records", roles: ["admin"] },
  { prefix: "/api/v1/prescriptions", roles: ["admin"] },
  { prefix: "/api/v1/re-examinations", roles: ["admin"] },
];

function normalizeRole(role: string) {
  return role === "user" ? "customer" : role;
}

function isPublicRoute(req: Request) {
  return publicRoutes.some((route) => (
    req.method === route.method &&
    req.path === route.path
  ));
}

function isAllowedByRouteRule(req: GatewayAuthRequest) {
  const role = normalizeRole(req.user?.role ?? "");
  const rule = routeRules.find((candidate) => (
    req.path.startsWith(candidate.prefix) &&
    (!candidate.methods || candidate.methods.includes(req.method))
  ));

  return !rule || rule.roles.includes(role);
}

export function gatewayAuthMiddleware(
  req: GatewayAuthRequest,
  res: Response,
  next: NextFunction,
) {
  if (req.method === "OPTIONS" || isPublicRoute(req)) {
    next();
    return;
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    res.status(500).json({
      success: false,
      message: "Gateway access token secret is not configured",
    });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const token = authHeader.split(" ")[1]!;
    const decoded = jwt.verify(token, accessTokenSecret) as JwtPayload & {
      user_id?: number;
      role?: string;
    };

    if (!decoded.user_id || !decoded.role) {
      res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
      return;
    }

    req.user = {
      user_id: decoded.user_id,
      role: normalizeRole(decoded.role),
    };

    if (!isAllowedByRouteRule(req)) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
      return;
    }

    next();
  } catch (_error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
}
