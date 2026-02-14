import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// ------------------------
// CORS setup for multiple origins (iframe-friendly)
// ------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://app.qtbot.dpdns.org",
  "https://chat.qtbot.dpdns.org",
  "https://staging.qtbot.dpdns.org",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(o => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true, // allow JWT cookies
  })
);

// ------------------------
// Other middleware
// ------------------------
app.use(express.json());
app.use(cookieParser());

// ------------------------
// API routes
// ------------------------
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ------------------------
// Serve frontend if production
// ------------------------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../../frontend/dist");

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ------------------------
// Start backend + WebSockets
// ------------------------
server.listen(PORT, () => {
  console.log("server is running on PORT:", PORT);
  connectDB();
});
