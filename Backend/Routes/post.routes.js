import express from "express";
import { uploadOnCloudinary } from "../Config/cloudinary.js";
import { createPost, getPost, toggleLike } from "../Controller/post.controller.js";
import isAuth from "../Middlewares/isAuth.js";
import upload from "../Middlewares/multer.js";
const postRouter = express.Router()

postRouter.post("/create",isAuth,upload.single("image"),createPost)
postRouter.get("/getpost",isAuth,getPost)
// postRouter.put("/like/:postId",isAuth,toggleLike)
postRouter.put("/like/:postId", isAuth, toggleLike);

export default postRouter