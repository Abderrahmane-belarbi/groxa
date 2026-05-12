import express from "express";
import { googleCallbackHandler, googleLoginHandler, Register } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", Register);

router.get("/google", googleLoginHandler);
router.get("/google/callback", googleCallbackHandler);
export default router;
