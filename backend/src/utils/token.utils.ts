import { Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export function createRefreshToken(
  userId: Types.ObjectId,
  tokenVersion: number,
) {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in environment variables",
    );
  }
  return jwt.sign({ userId, tokenVersion }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
}

export function createAccessToken(
  userId: Types.ObjectId,
  tokenVersion: number,
) {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error(
      "JWT_ACCESS_SECRET is not defined in environment variables",
    );
  }
  return jwt.sign({ userId, tokenVersion }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
    userId: string;
    tokenVersion: number;
  };
}

export function setAccessTokenCookie(
  res: Response,
  userId: Types.ObjectId,
  tokenVersion: number,
) {
  const accessToken = createAccessToken(userId, tokenVersion);
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // It prevents JavaScript in the browser from reading the cookie (prevent xss attacks)
    secure: process.env.NODE_ENV === "production", // cookie is only sent over HTTPS. in production mode
    sameSite: "strict", // This reduces CSRF risk by telling the browser: “Do not send this cookie on cross-site requests.”
    maxAge: 15 * 60 * 1000, // expire in 15 min
  });
  return accessToken;
}

export function setRefreshTokenCookie(
  res: Response,
  userId: Types.ObjectId,
  tokenVersion: number,
) {
  const refreshToken = createRefreshToken(userId, tokenVersion);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // It prevents JavaScript in the browser from reading the cookie (prevent xss attacks)
    secure: process.env.NODE_ENV === "production", // cookie is only sent over HTTPS. in production mode
    sameSite: "strict", // This reduces CSRF risk by telling the browser: “Do not send this cookie on cross-site requests.”
    maxAge: 30 * 24 * 60 * 60 * 1000, // expire in 30 days
  });
  return refreshToken;
}

export function setAuthCookies(
  res: Response,
  userId: Types.ObjectId,
  tokenVersion: number,
) {
  return {
    accessToken: setAccessTokenCookie(res, userId, tokenVersion),
    refreshToken: setRefreshTokenCookie(res, userId, tokenVersion),
  };
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export function clearAuthCookies(res: Response) {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
}