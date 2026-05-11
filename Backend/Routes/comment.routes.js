import express from "express";
import isAuth from "../Middlewares/isAuth.js";
import {
  addComment,
  deleteComment,
} from "../Controller/comment.controller.js";

const commentRouter = express.Router();

commentRouter.post("/add/:postId", isAuth, addComment);
commentRouter.delete("/delete/:postId/:commentId", isAuth, deleteComment);

export default commentRouter;