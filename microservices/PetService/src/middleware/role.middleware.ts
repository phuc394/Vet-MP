import {
  Request,
  Response,
  NextFunction,
} from "express";

const authorizeRoles = (
  ...roles: string[]
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({
        message: "Forbidden",
      });
      return;
    }

    next();
  };
};

export { authorizeRoles };