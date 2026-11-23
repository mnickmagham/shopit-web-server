import User from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signSessionToken } from "../middleware/auth";
import { toPublicUser } from "../utils/sanitizeUser";
import { rateLimit } from "../utils/rateLimit";

// signin controller
// input: { email, password } | { token }  — a token only restores the session
//        identified by that token; it is never used as a credential.
// success output: { user: PublicUser, token }
export default async function signinController(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, token } = req.body ?? {};

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Session restore: verify the token and issue a fresh one for the same
  // user. The token payload contains only { userId, email } — no password.
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { userId?: string };
      if (!decoded.userId) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const freshToken = signSessionToken({
        userId: String(user._id),
        email: user.email,
      });
      return res
        .status(200)
        .json({ user: toPublicUser(user), token: freshToken });
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }
  if (!EMAIL_RE.test(String(email))) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  // Rate-limit password attempts by IP so an attacker cannot lock out a
  // specific account by guessing its email.
  const rateKey = `signin:${req.ip ?? "unknown"}`;
  const rate = rateLimit(rateKey, { max: 5, windowMs: 60_000 });
  if (!rate.allowed) {
    return res
      .status(429)
      .json({ message: "Too many attempts. Try again later." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // bcrypt.compare only. The stored hash is never accepted as a password.
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const resToken = signSessionToken({
      userId: String(existingUser._id),
      email: existingUser.email,
    });
    return res
      .status(200)
      .json({ user: toPublicUser(existingUser), token: resToken });
  } catch (error) {
    console.error("signin error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
