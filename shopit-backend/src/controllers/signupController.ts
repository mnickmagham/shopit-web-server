import User from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { signSessionToken } from "../middleware/auth";
import { toPublicUser } from "../utils/sanitizeUser";
import { rateLimit } from "../utils/rateLimit";

// signup controller
// input: { email, password }
// success output: { user: PublicUser, token }
export default async function signupController(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body ?? {};

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }
  if (!EMAIL_RE.test(String(email))) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  // Rate-limit account creation by IP.
  const rateKey = `signup:${req.ip ?? "unknown"}`;
  const rate = rateLimit(rateKey, { max: 5, windowMs: 60_000 });
  if (!rate.allowed) {
    return res
      .status(429)
      .json({ message: "Too many attempts. Try again later." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    const token = signSessionToken({
      userId: String(newUser._id),
      email: newUser.email,
    });

    return res.status(200).json({ user: toPublicUser(newUser), token });
  } catch (error) {
    console.error("signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
