import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

// Replace localhost with your frontend domain
// Or use process.env.FRONTEND_URL
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// No frontend serving here — frontend is static and deployed separately

// Optional: basic health check
app.get("/health", (req, res) => {
  res.send({ status: "OK" });
});

// Start backend
server.listen(PORT, () => {
  console.log("Backend running on PORT:", PORT);
  connectDB();
});
