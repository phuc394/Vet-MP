import { NextFunction, Request, Response } from 'express';

function normalizeRole(role: string) {
  return role === 'user' ? 'customer' : role;
}

const identityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userId = Number(req.headers['x-user-id']);
  const role = normalizeRole(String(req.headers['x-user-role'] ?? ''));

  if (!Number.isInteger(userId) || !['admin', 'customer'].includes(role)) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  (req as any).user = { user_id: userId, role };
  next();
};

export { identityMiddleware };
