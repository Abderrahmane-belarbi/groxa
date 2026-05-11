import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../lib/validations/auth.validation";
import { z } from "zod";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateVerificationToken, generateVerificationTokenExpiresAt } from "../utils/generate-verification-token";
import { generateTokenSetCookie } from "../utils/generate-token-cookie";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if(!name || !email || !password) return res.status(400).json({ message: "All fields are required" })
  try {
    const result = await registerSchema.safeParseAsync({ name, email, password });
    if(!result.success) {
      const Flaterrors = z.flattenError(result.error).fieldErrors;
      const errors = {
        name: Flaterrors.name?.[0] || undefined,
        email: Flaterrors.email?.[0] || undefined,
        password: Flaterrors.password?.[0] || undefined,
      }
      return res.status(400).json({ message: "Validation failed", errors });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(409).json({ message: "Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiresAt = generateVerificationTokenExpiresAt();

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: verificationTokenExpiresAt,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req: Request, res: Response)  {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
  try {
    const result = await loginSchema.safeParseAsync({ email, password });
    if (!result.success) {
      const Flaterrors = z.flattenError(result.error).fieldErrors;
      const errors = {
        email: Flaterrors.email?.[0] || undefined,
        password: Flaterrors.password?.[0] || undefined,
      }
      return res.status(400).json({ message: "Validation failed", errors });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid email or password" });

    if (!user.emailVerified) return res.status(403).json({ message: "Please verify your email before logging in" });

    // jwt
    generateTokenSetCookie(res, user._id);

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? true : false,
      },
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    let message = "Internal server error";
    error instanceof Error && (message = error.message);
    return res.status(500).json({ message });
  }
}

export async function verificationEmail(req: Request, res: Response) {
  try {
    const { code, email } = req.body;
    if (!code || !email)
      return res.status(400).json({ message: "Required fields are missing" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Please Signup first" });

    if (user.emailVerified)
      return res.status(410).json({ message: "Email already verified" });

    if (!user.emailVerificationToken || !user.emailVerificationTokenExpires) {
      return res.status(400).json({ message: "No active verification token" });
    }

    if (String(user.emailVerificationToken) !== String(code))
      return res.status(400).json({ message: "Invalid verification code" });

    if (Date.now() > new Date(user.emailVerificationTokenExpires).getTime()) {
      return res.status(400).json({ message: "Token expired" });
    }

    user.emailVerified = new Date();
    user.emailVerificationTokenExpires = undefined;
    user.emailVerificationToken = undefined;

    await user.save();

    // jwt
    generateTokenSetCookie(res, user._id);

    return res.status(200).json({
      message: "The email has been verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? true : false,
      },
    });
  } catch (error) {
    console.error("Error in verificationEmail controller:", error);
    let message = "Internal server error";
    error instanceof Error && (message = error.message);
    return res.status(500).json({ message });
  }
}
