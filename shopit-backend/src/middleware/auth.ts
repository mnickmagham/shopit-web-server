import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  userId: string;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

export function signSessionToken(payload: AuthPayload): string {
  return jwt.sign(payload, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  } as jwt.SignOptions);
}

// Verifies the `jwt` field in the request body (the convention this API's
// frontend already uses). On success attaches req.auth; on failure responds
// 401 directly. Tokens identify a session — they never carry credentials.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.body?.jwt;
  if (!token || typeof token !== "string") {
    return res.status(401).json({ message: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token, getSecret()) as AuthPayload;
    if (!decoded.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.auth = { userId: decoded.userId, email: decoded.email };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Returns the verified auth payload attached by requireAuth, or responds 401
// and returns null if it is missing. Use instead of `req.auth!` so a route
// mounted without requireAuth fails closed rather than throwing.
// Note: when it returns null it has already sent the 401 response; callers
// must `return` after the check.
export function authUser(req: Request, res: Response): AuthPayload | null {
  if (!req.auth) {
    res.status(401).json({ message: "Authentication required" });
    return null;
  }
  return req.auth;
}
