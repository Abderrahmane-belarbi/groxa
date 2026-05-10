import { Request, Response } from "express";
import { registerSchema } from "../lib/validations/auth.validation";
import { z } from "zod";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

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

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      emailVerified: false,
      twoFactorEnabled: false,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}