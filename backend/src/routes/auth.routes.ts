import express from "express";
import { Register } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", Register);

export default router;
