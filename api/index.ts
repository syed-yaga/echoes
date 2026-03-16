import express from "express";

import dotenv from "dotenv";
import router from "./routes/user.route.js";
import authrouter from "./routes/auth.route.js";
import postrouter from "./routes/post.route.js";
import commentrouter from "./routes/comment.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dns from "dns";
import path from "path";

dotenv.config();
dns.setDefaultResultOrder("ipv4first");

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://echoes-wwgg.onrender.com"
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/user", router);
app.use("/api/auth", authrouter);
app.use("/api/post", postrouter);
app.use("/api/comment", commentrouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(express.static(path.join(process.cwd(), "client", "dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(process.cwd(), "client", "dist", "index.html"));
});

app.use((err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
