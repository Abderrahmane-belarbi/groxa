import express from "express";
import { googleCallbackHandler, googleLoginHandler, Login, Register, VerificationEmail } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/verify-email", VerificationEmail);

router.get("/google", googleLoginHandler);
router.get("/google/callback", googleCallbackHandler);

export default router;
