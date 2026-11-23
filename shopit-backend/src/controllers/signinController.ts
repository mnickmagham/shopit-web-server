import User from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//signup controller
//input:{email,password}
//success output:{message,user,token}
//error output:{message,error}
export default async (req: Request, res: Response) => {
import { rateLimit } from "../utils/rateLimit";
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  console.log("signin in progress...");
  let { email, password, token } = req.body;
  try {
    //if token is provided, decode it and get email and password for session authentication
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        email: string;
        password: string;
      };


      if (!decoded.email || !decoded.password) {
        return res.status(400).json({ message: "Invalid token" });
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      }
      email = decoded.email;
      password = decoded.password;
    }

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const existingUser = await User.findOne({ email });

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

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordCorrect: boolean =
      (await bcrypt.compare(password, existingUser.password)) ||
      password === existingUser.password;
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const resToken: string = jwt.sign(
      {
        password: existingUser.password,
        email: existingUser.email,
        userId: existingUser._id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    return res.status(200).json({ user: existingUser, token: resToken });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};
