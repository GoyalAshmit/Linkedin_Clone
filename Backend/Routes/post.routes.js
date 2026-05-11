import express from "express";

import isAuth from "../Middlewares/isAuth.js";

import upload from "../Middlewares/multer.js";

import {
  createPost,
  getPost,
  toggleLike,
  addComment,
  deleteComment,
  deletePost,
  editPost
} from "../Controller/post.controller.js";

const postRouter = express.Router();


// CREATE POST
postRouter.post(
  "/create",
  isAuth,
  upload.single("image"),
  createPost
);


// GET POSTS
postRouter.get(
  "/getpost",
  isAuth,
  getPost
);


// LIKE / UNLIKE
postRouter.put(
  "/like/:postId",
  isAuth,
  toggleLike
);


// ADD COMMENT
postRouter.post(
  "/comment/:postId",
  isAuth,
  addComment
);


// DELETE COMMENT
postRouter.delete(
  "/comment/:postId/:commentId",
  isAuth,
  deleteComment
);


// DELETE POST
postRouter.delete(
  "/delete/:postId",
  isAuth,
  deletePost
);


// EDIT POST
postRouter.put(
  "/edit/:postId",
  isAuth,
  editPost
);

export default postRouter;