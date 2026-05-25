import { NextFunction, Request, Response } from 'express';

function normalizeRole(role: string) {
  return role === 'user' ? 'customer' : role;
}

const authorizeRoles = (...roles: string[]) => {
  const allowedRoles = roles.map(normalizeRole);

  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(normalizeRole(user.role))) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    next();
  };
};

export { authorizeRoles };
