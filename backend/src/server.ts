import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/db";

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

app.get("/check", (req, res) => {
  res.json({ message: "Server is running!" });
});

async function start() {
  await connectToDatabase();
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  });
}

start().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
