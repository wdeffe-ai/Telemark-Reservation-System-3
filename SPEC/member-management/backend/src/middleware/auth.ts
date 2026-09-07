import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Role } from "../users";

dotenv.config();
const secret = process.env.JWT_SECRET || "dev_secret";

export interface AuthRequest extends Request {
  user?: { username: string; role: Role; displayName?: string };
}

export function ensureAuthenticated(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing Authorization" });
  const [, token] = header.split(" ");
  try {
    const payload = jwt.verify(token, secret) as any;
    req.user = { username: payload.username, role: payload.role, displayName: payload.displayName };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function ensureRole(allowed: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (!allowed.includes(req.user.role)) return res.status(403).json({ error: "Insufficient role" });
    next();
  };
}
