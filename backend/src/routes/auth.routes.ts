import express from "express";
import { googleCallbackHandler, googleLoginHandler, login, logout, refreshToken, register, verificationEmail } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verificationEmail);

router.post("/refresh-token", refreshToken);

router.get("/google", googleLoginHandler);
router.get("/google/callback", googleCallbackHandler);

export default router;
