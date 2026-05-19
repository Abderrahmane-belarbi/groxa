import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';


export function generateTokenSetCookie(res: Response, userId: Types.ObjectId) {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
  }
  // Generate JWT token
  // The token contains the user ID as a payload and is signed with a secret key. It expires in 7 days.
  // you can adjust the payload and expiration time as needed. For example, you might want to include the user's role or permissions in the token payload.
  const token = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "7d"
  });

  res.cookie("token", token, {
    httpOnly: true, // It prevents JavaScript in the browser from reading the cookie (prevent xss attacks)
    secure: process.env.NODE_ENV === "production", // cookie is only sent over HTTPS. in production mode
    sameSite: "strict", // This reduces CSRF risk by telling the browser: “Do not send this cookie on cross-site requests.”
    maxAge: 7 * 24 * 60 * 60 * 1000 // expire in 7 days
  });
  return token;
}