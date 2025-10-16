import mongoose from "mongoose";

const MONGODB_URI = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.bta9ljk.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI environment variable is not defined.");
}

// Maintain a global cached connection (so Vercel doesn't reconnect each time)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // Otherwise, create a new connection
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => {
        console.log("✅ MongoDB Connected:", mongoose.connection.host);
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
} 
