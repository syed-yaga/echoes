import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/user.route.js";
import authrouter from "./routes/auth.route.js";
import postrouter from "./routes/post.route.js";
import commentrouter from "./routes/comment.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose
  .connect(process.env.MONGODB || "")
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/user", router);
app.use("/api/auth", authrouter);
app.use("/api/post", postrouter);
app.use("/api/comment", commentrouter);
app.use((err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
