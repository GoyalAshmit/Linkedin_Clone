import express from "express";
import dotenv from "dotenv";

import connectDb from "./Config/db.js";

import authRouter from "./Routes/auth.routes.js";
import userRouter from "./Routes/user.routes.js";
import postRouter from "./Routes/post.routes.js";
import commentRouter from "./Routes/comment.routes.js";
import notificationRouter from "./Routes/notification.routes.js";

// JOB ROUTER
import jobRouter from "./Routes/job.routes.js";

import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();


// MIDDLEWARES
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

const allowedOrigins = [
  "https://linkedin-clone-six-mauve.vercel.app"
];

app.use(
  cors({
    origin: "https://linkedin-clone-six-mauve.vercel.app",
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));


// ROUTES
app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

app.use("/api/post", postRouter);

app.use("/api/comment", commentRouter);

app.use("/api/notification", notificationRouter);

// JOB ROUTES
app.use("/api/job", jobRouter);


// TEST ROUTE
app.get("/", (req, res) => {
  res.send("LinkedIn Clone Backend Running");
});


// SERVER
const port = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // CONNECT DATABASE FIRST
    await connectDb();

    // START SERVER AFTER DB CONNECTION
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("CRITICAL: Server failed to start due to Database Connection Error!");
    console.error("MongoDB Error Details ->", error.message);
    process.exit(1);
  }
};

startServer();