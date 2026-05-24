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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


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

app.listen(port, () => {

  connectDb();

  console.log(`Server running on port ${port}`);

});