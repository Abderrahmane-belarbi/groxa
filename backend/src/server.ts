import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/db";
import authRouter from "./routes/auth.routes";

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = Number(process.env.PORT) ?? 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get("/check", (req, res) => {
  res.json({ message: "Server is running!" });
});

async function startServer() {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
