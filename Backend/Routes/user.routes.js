import express from "express";
import isAuth from "../Middlewares/isAuth.js";

import {
  getCurrentUser,
  updateProfile,
  sendConnectionRequest,
  acceptConnectionRequest,
  removeConnection,
  getAllUsers,
  getUserProfile
} from "../Controller/user.controller.js";

import upload from "../Middlewares/multer.js";

let userRouter = express.Router();

// GET CURRENT USER
userRouter.get(
  "/currentuser",
  isAuth,
  getCurrentUser
);

// UPDATE PROFILE
userRouter.put(
  "/updateuser",
  isAuth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  updateProfile
);

// GET ALL USERS
userRouter.get(
  "/allusers",
  isAuth,
  getAllUsers
);

// SEND CONNECTION REQUEST
userRouter.put(
  "/send-request/:id",
  isAuth,
  sendConnectionRequest
);

// ACCEPT CONNECTION REQUEST
userRouter.put(
  "/accept-request/:id",
  isAuth,
  acceptConnectionRequest
);

// REMOVE CONNECTION
userRouter.put(
  "/remove-connection/:id",
  isAuth,
  removeConnection
);
userRouter.get(
  "/profile/:id",
  isAuth,
  getUserProfile
);
export default userRouter;