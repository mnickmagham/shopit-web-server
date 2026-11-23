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