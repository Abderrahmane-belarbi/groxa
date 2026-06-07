import { Request, Response } from "express";
import {
  loginSchema,
  registerSchema,
} from "../lib/validations/auth.validation";
import { z } from "zod";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import {
  generateVerificationToken,
  generateVerificationTokenExpiresAt,
} from "../utils/generate-verification-token";
import {
  createRefreshToken,
  setAuthCookies,
} from "../utils/token.utils";
import { sendMail } from "../config/google-mailer";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import { verifyRefreshToken } from "../utils/token.utils";

function getGoogleClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.NODE_ENV === "development"
      ? process.env.LOCAL_GOOGLE_REDIRECT_URI
      : process.env.PUBLIC_GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri)
    throw new Error("Google client credentials not found");
  return new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri,
  });
}

function setGoogleOAuthStateCookie(res: Response, state: string) {
  res.cookie("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000, // 10 minutes
  });
}

function clearGoogleOAuthStateCookie(res: Response) {
  res.clearCookie("google_oauth_state", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
  });
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });
  try {
    const result = await registerSchema.safeParseAsync({
      name,
      email,
      password,
    });
    if (!result.success) {
      const Flaterrors = z.flattenError(result.error).fieldErrors;
      const errors = {
        name: Flaterrors.name?.[0] || undefined,
        email: Flaterrors.email?.[0] || undefined,
        password: Flaterrors.password?.[0] || undefined,
      };
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

    await sendMail({
      to: newUser.email,
      subject: "Verify your email",
      text: `Your verification code is ${verificationToken}`,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });
  try {
    const result = await loginSchema.safeParseAsync({ email, password });
    if (!result.success) {
      const Flaterrors = z.flattenError(result.error).fieldErrors;
      const errors = {
        email: Flaterrors.email?.[0] || undefined,
        password: Flaterrors.password?.[0] || undefined,
      };
      return res.status(400).json({ message: "Validation failed", errors });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password" });

    // Check if email is verified
    // You can delete the check if you don't want to force email verification before login
    if (!user.emailVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });

    // jwt
    const authCookies = setAuthCookies(res, user._id, user.tokenVersion);

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? true : false,
        ...authCookies,
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
    if (!user) return res.status(400).json({ message: "User not found" });

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
    user.emailVerificationTokenExpires = null;
    user.emailVerificationToken = null;

    await user.save();

    // jwt
    const authCookies = setAuthCookies(res, user._id, user.tokenVersion);

    return res.status(200).json({
      message: "The email has been verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? true : false,
        ...authCookies
      },
    });
  } catch (error) {
    console.error("Error in verificationEmail controller:", error);
    let message = "Internal server error";
    error instanceof Error && (message = error.message);
    return res.status(500).json({ message });
  }
}

export async function googleLoginHandler(_req: Request, res: Response) {
  try {
    const client = getGoogleClient();
    const state = crypto.randomBytes(32).toString("hex");
    setGoogleOAuthStateCookie(res, state);
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "profile", "email"],
      prompt: "consent",
      state, // for CSRF protection
    });
    return res.redirect(url);
  } catch (error) {
    let message = "Internal server error";
    error instanceof Error && (message = error.message);
    return res.status(500).json({ error: message });
  }
}

export async function googleCallbackHandler(req: Request, res: Response) {
  const code = req.query.code;
  if (!code || typeof code !== "string")
    return res.status(400).json({ error: "Code not found" });
  const state = req.query.state;
  const stateFromCookie = req.cookies?.google_oauth_state;
  if (!code) return res.status(400).json({ error: "Code not found" });
  if (!state || !stateFromCookie || state !== stateFromCookie) {
    clearGoogleOAuthStateCookie(res);
    return res.status(400).json({ error: "Invalid OAuth state" });
  }
  try {
    clearGoogleOAuthStateCookie(res);
    const client = getGoogleClient();
    const { tokens } = await client.getToken(code);
    if (!tokens?.id_token)
      return res.status(400).json({ error: "Google ID token not found" });
    // verify token and read the user info from it
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: "Invalid Google token payload" });
    }
    const email = payload?.email;
    const emailVerified = payload?.email_verified;
    if (!email || !emailVerified)
      return res.status(400).json({ error: "Email not verified" });
    const emailNormalized = email.toLowerCase().trim();
    let user = await User.findOne({ email: emailNormalized });

    if (!user) {
      user = await User.create({
        name: payload?.name,
        email: emailNormalized,
        password: undefined,
        emailVerified: new Date(),
      });
    } else {
      if (!user.emailVerified) {
        user.emailVerified = new Date();
        user.emailVerificationToken = null;
        user.emailVerificationTokenExpires = null;
      }
      await user.save();
    }
    setAuthCookies(res, user._id, user.tokenVersion);
    const redirectUrl = `${process.env.MODE === "development" ? process.env.LOCAL_CLIENT_URL : process.env.PUBLIC_CLIENT_URL}/dashboard`;
    return res.redirect(redirectUrl);
  } catch (error) {
    let message = "Internal server error";
    error instanceof Error && (message = error.message);
    return res.status(500).json({ error: message });
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) return res.status(401).json({ error: "No token provided" });
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error(
        "JWT_ACCESS_SECRET is not defined in environment variables",
      );
    }
    const payload = verifyRefreshToken(token);
    console.log("payload:", payload);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ error: "User not found" });
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ error: "Token has been revoked" });
    }
    const authCookies = setAuthCookies(res, user._id, user.tokenVersion);

    return res.status(200).json({ message: "Token refreshed successfully", authCookies });
  } catch (error) {
    let message = "Internal server error";
    error instanceof Error && (message = error.message);
    return res.status(500).json({ error: message });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    
    // Generate reset token and hash it for security
    const resetPasswordToken = crypto.randomUUID();
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");
    // Update user token
    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 min
    await user.save();

    // Send email to user resetPasswordToken not the hashed
    // Send the raw token to the user in the link
    // When user comes back with raw token, you hash it and compare to DB
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;
    sendMail({
      to: user.email,
      subject: "Reset your password",
      text: `You requested a password reset. Use this link to reset your password:\n${resetUrl} (expires in 10 minutes).\nIf you didn't request this, ignore this email.`,
    });

    return res.status(200).json({
      message:
        "If an account exists, a reset link has been sent. Check your inbox and spam folder.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}