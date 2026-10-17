import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDatabase = async (): Promise<typeof mongoose> => {
  try {
    mongoose.set("strictQuery", true);
    
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    
    mongoose.connection.on("error", (err) => {
      console.error(`[MongoDB] Connection error:`, err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn(`[MongoDB] Connection disconnected`);
    });

    return conn;
  } catch (error) {
    console.error("[MongoDB] Connection failure:", error);
    // In production we would exit, but during bootstrapping/tests we allow server to surface health status
    if (ENV.NODE_ENV === "production") {
      process.exit(1);
    }
    throw error;
  }
};

