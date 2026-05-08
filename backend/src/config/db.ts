import mongoose from "mongoose";

export async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in the environment variables.");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if (conn) console.log("Connected to MongoDB");
    
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
