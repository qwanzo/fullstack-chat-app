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

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// List of allowed domains (you can add subdomains / staging)
const allowedOrigins = [
  "http://localhost:5173",             // local frontend
  "http://localhost:8080",             // another dev port
  "https://app.qtbot.dpdns.org",           // production main domain
  "https://chat.qtbot.dpdns.org",          // production subdomain
  "https://staging.qtbot.dpdns.org",       // staging
  // add more as needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or server-to-server)
      if (!origin) return callback(null, true);

      // Check if the origin is allowed
      if (allowedOrigins.some(o => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true, // important for cookies (JWT)
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
